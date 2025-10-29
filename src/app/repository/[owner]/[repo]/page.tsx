import { getRepositoryDetails } from '@/lib/github-data';
import { notFound } from 'next/navigation';
import RepoAnalysis from './components/RepoAnalysis';
import ReadmeEditor from './components/ReadmeEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export default async function RepositoryPage({ params }: { params: { owner: string; repo: string } }) {
  
  // The suspense boundary will show a skeleton while this data is being fetched.
  const repoDetails = await getRepositoryDetails(params.owner, params.repo);

  if (!repoDetails) {
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
