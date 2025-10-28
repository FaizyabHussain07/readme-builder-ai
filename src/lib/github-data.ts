// This is a mock data file. In a real app, you'd fetch this from the GitHub API.

export interface Repository {
  id: number;
  name: string;
  owner: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface RepoDetails extends Repository {
  fileStructure: string;
  dependencies: string;
  license: string;
}

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
  },
];

const repoDetails: Record<string, RepoDetails> = {
  'react-kanban-board': {
    ...repositories[0],
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
    ...repositories[1],
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
    ...repositories[2],
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
    ...repositories[3],
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
    ...repositories[4],
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
    ...repositories[5],
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

export async function getRepositories(): Promise<Repository[]> {
  await delay(1000);
  return repositories;
}

export async function getRepositoryDetails(owner: string, name: string): Promise<RepoDetails | undefined> {
  await delay(500);
  return repoDetails[name];
}
