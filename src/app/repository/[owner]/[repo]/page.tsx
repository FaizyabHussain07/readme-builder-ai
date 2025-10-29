import { getRepositoryDetails } from '@/lib/github-data';
import { notFound, redirect } from 'next/navigation';
import RepoAnalysis from './components/RepoAnalysis';
import ReadmeEditor from './components/ReadmeEditor';
import { Suspense } from 'react';
import { getGitHubAccessToken } from '@/lib/github-data';
import { Skeleton } from '@/components/ui/skeleton';


// Component to fetch and display repository details
async function RepoDetails({ owner, repo }: { owner: string; repo: string }) {
  const accessToken = await getGitHubAccessToken();
  if (!accessToken) {
    // This should be handled by the Header's redirect, but it's a safeguard
    redirect('/');
  }

  const repoDetails = await getRepositoryDetails(accessToken, owner, repo);

  if (!repoDetails) {
    // If details can't be fetched, maybe the repo doesn't exist or user lacks permission
    notFound();
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 container py-8">
      <div className="lg:col-span-4">
        <RepoAnalysis repoDetails={repoDetails} />
      </div>
      <div className="lg:col-span-8">
        <ReadmeEditor repoDetails={repoDetails} />
      </div>
    </div>
  );
}

// Skeleton component for loading state
function RepoDetailsSkeleton() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 container py-8">
      <div className="lg
:col-span-4">
        <div className="sticky top-24 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
      <div className="lg:col-span-8 space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}


export default function RepositoryPage({ params }: { params: { owner: string; repo: string } }) {
  return (
    <Suspense fallback={<RepoDetailsSkeleton />}>
      <RepoDetails owner={params.owner} repo={params.repo} />
    </Suspense>
  );
}
