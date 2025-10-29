import { cookies } from 'next/headers';
import { unstable_cache as cache } from 'next/cache';
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

/**
 * Initializes the Firebase Admin SDK.
 * This function is memoized to ensure it's only initialized once.
 */
const getFirebaseAdminApp = cache(async () => {
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    // This is a critical error for server-side auth.
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Go to Project Settings > Service Accounts in the Firebase console to generate a new private key.');
  }

  // Ensure no duplicate apps are initialized.
  if (!getApps().length) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccountKey)),
    });
  }
  return getApps()[0]; // Return existing app
}, ['firebase-admin-app']);


/**
 * Securely retrieves the GitHub access token for the current user from their session cookie.
 * This function is intended to be called from Server Components or Route Handlers.
 * @returns {Promise<string | null>} The GitHub access token, or null if the user is not authenticated.
 */
export async function getGitHubAccessToken(): Promise<string | null> {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return null; // No session cookie, user is not logged in.
    }

    const adminApp = await getFirebaseAdminApp();
    const adminAuth = await import('firebase-admin/auth');

    // Verify the session cookie to get the decoded ID token.
    const decodedIdToken = await adminAuth.getAuth(adminApp).verifySessionCookie(sessionCookie, true);

    // Fetch the full user record to access provider-specific data.
    const user = await adminAuth.getAuth(adminApp).getUser(decodedIdToken.uid);

    // Find the GitHub provider data which contains the access token.
    const githubProviderData = user.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );
    
    // The access token is not directly on the providerData object itself.
    // It's part of the raw JSON that Firebase stores. We need to parse it.
    if (githubProviderData && githubProviderData.toJSON) {
      const providerJson = githubProviderData.toJSON() as any;
      // The access token is typically available in the `accessToken` field after parsing.
      // This is a custom claim added by Firebase upon GitHub sign-in.
      if (providerJson.accessToken) {
        return providerJson.accessToken;
      }
    }

    // This part should ideally not be reached if the user signed in with GitHub.
    console.warn('GitHub access token not found in user\'s provider data.');
    return null;

  } catch (error) {
    // Errors can happen if the cookie is invalid or expired.
    console.error('Error verifying session cookie or getting GitHub access token:', error);
    return null;
  }
}


/**
 * Fetches the repositories for the authenticated user.
 * This function is cached to improve performance.
 * @param {string} token - The user's GitHub access token.
 * @returns {Promise<Repository[] | null>} A list of repositories, or null on error.
 */
export const getRepositories = cache(
  async (token: string): Promise<Repository[] | null> => {
    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&type=owner', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        // Use a short cache lifetime for user-specific, frequently updated data.
        next: { revalidate: 60 } 
      });

      if (!response.ok) {
        console.error(`GitHub API responded with ${response.status} for /user/repos`);
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
  ['user-repositories'] // Cache key
);

/**
 * Fetches detailed information for a single repository.
 * This function is cached to improve performance.
 * @param {string} token - The user's GitHub access token.
 * @param {string} owner - The repository owner's username.
 * @param {string} name - The repository name.
 * @returns {Promise<RepoDetails | undefined>} Detailed repository info, or undefined on error.
 */
export const getRepositoryDetails = cache(
  async (token: string, owner: string, name: string): Promise<RepoDetails | undefined> => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Get basic repo details
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
      if (!repoResponse.ok) {
        console.error(`GitHub API responded with ${repoResponse.status} for /repos/${owner}/${name}`);
        return undefined;
      }
      const repoData = await repoResponse.json();

      // 2. Get file structure (tree)
      const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/git/trees/main?recursive=1`, { headers });
      let fileStructure = 'Could not load file structure.';
      if (treeResponse.ok) {
        const treeData = await treeResponse.json();
        // Limit to a reasonable number of files for the prompt
        fileStructure = treeData.tree.map((file: any) => `- ${file.path}`).slice(0, 20).join('\n');
      }

      // 3. Get dependencies (from package.json, if it exists)
      let dependencies = 'No package.json found.';
      try {
        const packageJsonResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/package.json`, { headers });
        if (packageJsonResponse.ok) {
          const packageJsonData = await packageJsonResponse.json();
          const content = Buffer.from(packageJsonData.content, 'base64').toString('utf-8');
          const parsed = JSON.parse(content);
          const allDeps = { ...parsed.dependencies, ...parsed.devDependencies };
          dependencies = Object.keys(allDeps).length > 0 ? Object.keys(allDeps).join(', ') : 'No dependencies listed.';
        }
      } catch (e) {
        console.log(`Could not read package.json for ${owner}/${name}`);
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
      console.error(`Failed to fetch repository details for ${owner}/${name}:`, error);
      return undefined;
    }
  },
  ['repo-details'] // Base cache key
);
