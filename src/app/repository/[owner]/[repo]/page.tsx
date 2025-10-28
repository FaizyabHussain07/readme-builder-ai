import { getRepositoryDetails } from '@/lib/github-data';
import { notFound } from 'next/navigation';
import RepoAnalysis from './components/RepoAnalysis';
import ReadmeEditor from './components/ReadmeEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export default async function RepositoryPage({ params }: { params: { owner: string; repo: string } }) {
  const repoDetails = await getRepositoryDetails(params.owner, params.repo);

  if (!repoDetails) {
    notFound();
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 container py-8">
      <div className="lg:col-span-4">
        <Suspense fallback={<RepoAnalysisSkeleton />}>
          <RepoAnalysis repoDetails={repoDetails} />
        </Suspense>
      </div>
      <div className="lg:col-span-8">
        <ReadmeEditor repoDetails={repoDetails} />
      </div>
    </div>
  );
}

function RepoAnalysisSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Repository Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
