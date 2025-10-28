import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type RepoDetails } from '@/lib/github-data';
import { GitMerge, Library, Scale } from 'lucide-react';

interface RepoAnalysisProps {
  repoDetails: RepoDetails;
}

export default function RepoAnalysis({ repoDetails }: RepoAnalysisProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline">Repository Analysis</CardTitle>
        <CardDescription>Key information extracted from your repository.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md">
            <Library className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-semibold">Dependencies</h4>
            <p className="text-sm text-muted-foreground font-mono bg-secondary px-2 py-1 rounded-md mt-1">
              {repoDetails.dependencies}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md">
            <Scale className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-semibold">License</h4>
            <p className="text-sm text-muted-foreground font-mono bg-secondary px-2 py-1 rounded-md mt-1">{repoDetails.license}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md">
            <GitMerge className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-semibold">File Structure</h4>
            <pre className="text-sm text-muted-foreground font-mono bg-secondary p-3 rounded-md mt-1 whitespace-pre-wrap">
              <code>{repoDetails.fileStructure.trim()}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
