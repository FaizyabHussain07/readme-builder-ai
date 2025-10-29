import { auth } from 'firebase-admin/lib/auth';
import { cookies } from 'next/headers';
import { unstable_cache as cache } from 'next/cache';
import { GithubAuthProvider, getAuth } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';


export interface Repository {
  id: number;
  name: string;
  owner: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  ownerAvatar: string;
}

export interface RepoDetails extends Repository {
  fileStructure: string;
  dependencies: string;
  license: string;
}

async function getFirebaseAdminApp() {
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  // This environment variable needs to be set in your deployment environment.
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) {
    throw new Error('Firebase service account key is not set.');
  }

  if (!getApps().length) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    });
  }
  return getApps()[0];
}


export async function getGitHubAccessToken() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      console.log('Session cookie not found');
      return null;
    }
    const adminApp = await getFirebaseAdminApp();
    const adminAuth = await import('firebase-admin/auth');
    const decodedIdToken = await adminAuth.getAuth(adminApp).verifySessionCookie(sessionCookie, true);
    
    if (decodedIdToken.firebase.sign_in_provider !== 'github.com') {
        return null;
    }

    // The access token is reliably available in the `decodedIdToken` after a Firebase GitHub sign-in.
    // However, it's not directly on the top-level object. We need to access it from the provider data.
    // This is a custom claim that Firebase automatically creates.
    // Note: The shape of this object can be complex. The `find` is a robust way to get it.
    const githubProviderInfo = decodedIdToken.firebase.identities['github.com'];

    // This is a more robust way to get the access token. It's stored in the user's auth record.
    // For this to work, we need to fetch the user record from Firebase Admin Auth.
    const user = await adminAuth.getAuth(adminApp).getUser(decodedIdToken.uid);
    const githubProviderData = user.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );
    
    // This is where the access token is stored.
    // It's not directly available in the session cookie for security reasons.
    // You'd typically use the Admin SDK to get the user record and then find the provider data.
    // For this app, we'll simulate this by returning the environment variable if available.
    // In a real production app, you would implement a secure way to get the real token
    // for the logged-in user, likely by calling a secure cloud function.
    if (process.env.GITHUB_ACCESS_TOKEN) {
       return process.env.GITHUB_ACCESS_TOKEN;
    }

    console.warn("Could not retrieve GitHub access token. Using a placeholder. API calls will be limited.");
    return 'mock_token_placeholder';

  } catch (error) {
    console.error('Error getting GitHub access token:', error);
    return null;
  }
}


export const getRepositories = cache(
  async (token: string | null): Promise<Repository[] | null> => {
    
    if (!token || token === 'mock_token_placeholder') {
      console.log("No valid GitHub token available. Cannot fetch repositories.");
      return null;
    }

    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&type=owner', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!response.ok) {
        console.error('GitHub API responded with:', response.status);
        return null;
      }
      const data = await response.json();

      return data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description || 'No description available.',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true }),
        ownerAvatar: repo.owner.avatar_url,
      }));

    } catch (error) {
      console.error('Failed to fetch repositories from GitHub:', error);
      return null;
    }
  },
  ['user-repositories'],
  { revalidate: 60 } // Cache for 1 minute
);


// Helper function to get the contents of a repository
async function getRepoContents(token: string, owner: string, repo: string, path: string = '') {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) return [];
  return response.json();
}


async function getFileContent(token: string, url: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw', // Get raw content
    },
  });
  if (!response.ok) return '';
  return response.text();
}


export const getRepositoryDetails = cache(
  async (owner: string, name: string): Promise<RepoDetails | undefined> => {
    const token = await getGitHubAccessToken();
    if (!token) return undefined;

    try {
      // 1. Get basic repo details
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      if (!repoResponse.ok) return undefined;
      const repoData = await repoResponse.json();

      // 2. Get file structure (tree)
      const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/git/trees/main?recursive=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let fileStructure = 'Could not load file structure.';
      if (treeResponse.ok) {
        const treeData = await treeResponse.json();
        fileStructure = treeData.tree.map((file: any) => `- ${file.path}`).slice(0, 15).join('\n'); // Limit to 15 files
      }

      // 3. Get dependencies (from package.json)
      let dependencies = 'package.json not found.';
      const packageJsonUrl = `https://api.github.com/repos/${owner}/${name}/contents/package.json`;
      const packageJsonResponse = await fetch(packageJsonUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (packageJsonResponse.ok) {
        const packageJsonData = await packageJsonResponse.json();
        const content = Buffer.from(packageJsonData.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(content);
        dependencies = Object.keys({ ...parsed.dependencies, ...parsed.devDependencies }).join(', ');
      }

      const details: RepoDetails = {
        id: repoData.id,
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description || 'No description.',
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        updatedAt: formatDistanceToNow(new Date(repoData.updated_at), { addSuffix: true }),
        ownerAvatar: repoData.owner.avatar_url,
        fileStructure,
        dependencies,
        license: repoData.license?.name || 'No license specified.',
      };
      
      return details;

    } catch (error) {
      console.error("Failed to fetch repository details:", error);
      return undefined;
    }
  },
  ['repo-details'],
  { revalidate: 60 }
);