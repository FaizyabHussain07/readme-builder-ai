import { auth } from 'firebase-admin/lib/auth';
import { cookies } from 'next/headers';
import { unstable_cache as cache } from 'next/cache';
import { GithubAuthProvider, getAuth } from 'firebase/auth';

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
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

  if (!getApps().length) {
    return initializeApp({
      credential: cert(serviceAccount),
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
    
    // This is not a standard place to get the access token from.
    // In a proper OAuth flow, you'd securely store the access token after the user logs in
    // and retrieve it for server-side API calls.
    // For this demonstration, we're assuming the access token might be available in custom claims,
    // which is one secure way to handle it. However, this app doesn't implement that claim-setting logic.
    
    // A robust implementation would involve a custom auth flow to store and retrieve the token,
    // but that's beyond the current scope.
    // We'll rely on a mock token as the secure retrieval mechanism isn't fully built out.
    // In a real scenario, the token would be fetched from a secure store like Firestore
    // or passed via a custom claim.
    return process.env.GITHUB_ACCESS_TOKEN || 'mock_token';

  } catch (error) {
    console.error('Error getting GitHub access token:', error);
    return null;
  }
}


export const getRepositories = cache(
  async (token: string | null): Promise<Repository[] | null> => {
    
    if (!token) {
      console.log("No GitHub token available. Returning empty array.");
      // Return null to indicate an error state to the UI
      return null;
    }

    try {
      // With a real token, you would fetch from the GitHub API
      // const response = await fetch('https://api.github.com/user/repos?sort=updated&type=owner', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'X-GitHub-Api-Version': '2022-11-28',
      //   },
      // });

      // if (!response.ok) {
      //   console.error('GitHub API responded with:', response.status);
      //   return null;
      // }
      // const data = await response.json();

      const mockData: Repository[] = [
        {
          id: 1,
          name: 'react-kanban-board',
          owner: 'user',
          description: 'A simple Kanban board application built with React and TypeScript.',
          language: 'TypeScript',
          stars: 125,
          forks: 30,
          updatedAt: '2 days ago',
          ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        {
          id: 2,
          name: 'node-api-starter',
          owner: 'user',
          description: 'A boilerplate for building RESTful APIs with Node.js, Express, and MongoDB.',
          language: 'JavaScript',
          stars: 480,
          forks: 150,
          updatedAt: '5 days ago',
          ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        {
          id: 3,
          name: 'awesome-design-patterns',
          owner: 'user',
          description: 'A curated list of software design patterns and principles.',
          language: null,
          stars: 2300,
          forks: 450,
          updatedAt: '1 week ago',
          ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        {
          id: 4,
          name: 'python-data-science-utils',
          owner: 'user',
          description: 'A collection of utility functions for data science projects in Python.',
          language: 'Python',
          stars: 78,
          forks: 12,
          updatedAt: '3 weeks ago',
          ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        {
          id: 5,
          name: 'personal-portfolio-v2',
          owner: 'user',
          description: 'My personal portfolio website built with Next.js and Tailwind CSS.',
          language: 'TypeScript',
          stars: 34,
          forks: 5,
          updatedAt: '1 month ago',
          ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        {
          id: 6,
          name: 'dotfiles',
          owner: 'user',
          description: 'My personal dotfiles for customizing my development environment.',
          language: 'Shell',
          stars: 92,
          forks: 22,
          updatedAt: '2 months ago',
          ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
      ];

      return mockData.map((repo) => ({
        ...repo,
        owner: repo.owner || 'unknown',
        ownerAvatar: repo.ownerAvatar || '',
      }));
    } catch (error) {
      console.error('Failed to fetch repositories from GitHub:', error);
      return null;
    }
  },
  ['user-repositories'],
  { revalidate: 60 }
);


const repoDetails: Record<string, RepoDetails> = {
  'react-kanban-board': {
    id: 1,
    name: 'react-kanban-board',
    owner: 'user',
    description: 'A simple Kanban board application built with React and TypeScript.',
    language: 'TypeScript',
    stars: 125,
    forks: 30,
    updatedAt: '2 days ago',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    fileStructure: `
- src
  - components
  - App.tsx
- package.json
`,
    dependencies: 'React, TypeScript, dnd-kit',
    license: 'MIT',
  },
  'node-api-starter': {
    id: 2,
    name: 'node-api-starter',
    owner: 'user',
    description: 'A boilerplate for building RESTful APIs with Node.js, Express, and MongoDB.',
    language: 'JavaScript',
    stars: 480,
    forks: 150,
    updatedAt: '5 days ago',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    fileStructure: `
- src
  - controllers
  - models
  - routes
  - server.js
- package.json
`,
    dependencies: 'Express, Mongoose, dotenv',
    license: 'ISC',
  },
  'awesome-design-patterns': {
    id: 3,
    name: 'awesome-design-patterns',
    owner: 'user',
    description: 'A curated list of software design patterns and principles.',
    language: null,
    stars: 2300,
    forks: 450,
    updatedAt: '1 week ago',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    fileStructure: `
- creational
- structural
- behavioral
- README.md
`,
    dependencies: 'N/A',
    license: 'CC0-1.0',
  },
  'python-data-science-utils': {
    id: 4,
    name: 'python-data-science-utils',
    owner: 'user',
    description: 'A collection of utility functions for data science projects in Python.',
    language: 'Python',
    stars: 78,
    forks: 12,
    updatedAt: '3 weeks ago',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    fileStructure: `
- my_utils
  - cleaning.py
  - visualization.py
- setup.py
`,
    dependencies: 'pandas, numpy, matplotlib',
    license: 'MIT',
  },
  'personal-portfolio-v2': {
    id: 5,
    name: 'personal-portfolio-v2',
    owner: 'user',
    description: 'My personal portfolio website built with Next.js and Tailwind CSS.',
    language: 'TypeScript',
    stars: 34,
    forks: 5,
    updatedAt: '1 month ago',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    fileStructure: `
- src
  - app
  - components
  - lib
- next.config.ts
`,
    dependencies: 'Next.js, React, Tailwind CSS',
    license: 'MIT',
  },
  dotfiles: {
    id: 6,
    name: 'dotfiles',
    owner: 'user',
    description: 'My personal dotfiles for customizing my development environment.',
    language: 'Shell',
    stars: 92,
    forks: 22,
    updatedAt: '2 months ago',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    fileStructure: `
- .zshrc
- .vimrc
- install.sh
`,
    dependencies: 'zsh, vim',
    license: 'Unlicense',
  },
};

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export async function getRepositoryDetails(owner: string, name: string): Promise<RepoDetails | undefined> {
  await delay(500);
  // This is a simplified look up. In a real app, you might fetch this from the API as well.
  const detail = repoDetails[name];
  if (detail && detail.owner === owner) {
    return detail;
  }
  
  // Fallback for repos not in the mock details
  // Note: This relies on the mock `getRepositories` data.
  const repos = await getRepositories(await getGitHubAccessToken());
  const repo = repos?.find(r => r.name === name && r.owner === owner);

  if (repo) {
    return {
      ...repo,
      fileStructure: 'src/ (...)\npackage.json\nREADME.md',
      dependencies: 'Not found',
      license: 'Not found',
    }
  }
  
  return undefined;
}
