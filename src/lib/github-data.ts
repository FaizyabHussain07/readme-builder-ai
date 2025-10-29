
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { unstable_cache as cache } from 'next/cache';

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

async function getGitHubAccessToken() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      console.log('Session cookie not found');
      return null;
    }
    const decodedIdToken = await auth().verifySessionCookie(sessionCookie, true);
    
    // This is a simplified way to get the token. 
    // In a real app, you might need to handle token refresh.
    // The access token is not directly available in the decoded ID token.
    // A more robust solution would involve using the Firebase Admin SDK to get the full user record
    // or, more simply, getting it on the client and passing it to a server action.
    // For this context, we will assume a mechanism exists to get the token.
    // Let's fetch the user to get the provider data.
    const user = await auth().getUser(decodedIdToken.uid);
    const githubProvider = user.providerData.find(p => p.providerId === 'github.com');
    
    // This is a mock-up of how one might get an access token.
    // The actual token is not available this way for security reasons.
    // A proper implementation requires server-side OAuth handling to store and retrieve this.
    // For the purpose of this demo, we'll proceed with a simulated API call that doesn't need a real token.
    
    // A real implementation would look something like this, but requires more setup:
    // const credential = GithubAuthProvider.credential(user.providerData[0].uid, user.providerData[0].accessToken);
    // return credential.accessToken;

    // For now, this is a placeholder. Let's try to get a token from the custom claims if it were stored there.
    // This is NOT standard practice and is for demonstration only.
    if (decodedIdToken.firebase.sign_in_provider === 'github.com') {
       // This is a conceptual placeholder. The token isn't in claims by default.
       // In a real app, we'd use a server action and get the token on the client.
       // But to make the page a server component, we fetch here.
       // Let's use a mock call for now.
    }
    
    // Since we cannot get the real access token securely on the server this way without more complex setup,
    // we will simulate the user for the API call.
    return "mock_token";


  } catch (error) {
    console.error('Error getting GitHub access token:', error);
    return null;
  }
}


export const getRepositories = cache(
  async (): Promise<Repository[] | null> => {
    // In a real app, we would use the user's access token to fetch their repositories.
    // Since we can't get it securely here without a more complex setup,
    // we will continue to use mock data, but structure the code as if we were.
    const token = await getGitHubAccessToken();

    if (!token) {
      console.log("No GitHub token available. Returning empty array.");
      return [];
    }

    try {
        // This is where you would fetch the user's repositories from the GitHub API
        // For example: const response = await fetch('https://api.github.com/user/repos', { ... });
        // Since we are using a mock, let's just return the mock data.
      
        const repositories: Repository[] = [
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

      return repositories.map((repo) => ({
        ...repo,
        updatedAt: repo.updatedAt,
        owner: repo.owner,
        ownerAvatar: repo.ownerAvatar,
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
  const repo = (await getRepositories())?.find(r => r.name === name && r.owner === owner);
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