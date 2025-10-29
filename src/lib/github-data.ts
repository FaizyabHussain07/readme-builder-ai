
import { unstable_cache as cache } from 'next/cache';
import { formatDistanceToNow } from 'date-fns';
import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
    });
}


/**
 * Securely retrieves the GitHub access token for the current user directly from the session cookie.
 * This function is intended to be called from Server Components or Route Handlers.
 * @returns {Promise<string | null>} The GitHub access token, or null if the user is not authenticated.
 */
export async function getGitHubAccessToken(): Promise<string | null> {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return null; // No session cookie, user is not logged in.
    }

    // Verify the session cookie and get the user's data
    const decodedIdToken = await getAuth().verifySessionCookie(sessionCookie, true);
    const user = await getAuth().getUser(decodedIdToken.uid);

    // Find the GitHub provider data to extract the access token
    const githubProviderData = user.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );
    
    // The provider data is a plain JSON object, so we can cast it to access its properties.
    const providerJson = githubProviderData?.toJSON() as any;

    if (providerJson?.accessToken) {
      return providerJson.accessToken;
    }

    console.warn('GitHub access token not found in user provider data.');
    return null;

  } catch (error) {
    console.error('Error verifying session cookie or getting GitHub access token:', error);
    // This can happen if the cookie is invalid or expired.
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
