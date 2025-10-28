import { Suspense } from 'react';
import RepoCard, { RepoCardSkeleton } from '@/components/RepoCard';
import { getRepositories, type Repository } from '@/lib/github-data';

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Your Repositories</h1>
        <p className="text-muted-foreground">Select a repository to generate a README for.</p>
      </div>

      <Suspense fallback={<RepoGridSkeleton />}>
        <RepoGrid />
      </Suspense>
    </div>
  );
}

async function RepoGrid() {
  const repos = await getRepositories();

  if (!repos || repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No repositories found</h3>
        <p className="text-sm text-muted-foreground">It seems you don&apos;t have any public repositories.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo: Repository) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}

function RepoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <RepoCardSkeleton key={i} />
      ))}
    </div>
  );
}
