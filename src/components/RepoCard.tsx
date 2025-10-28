import { type Repository } from '@/lib/github-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { GitFork, Star, Book } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export default function RepoCard({ repo }: { repo: Repository }) {
  return (
    <Link href={`/repository/${repo.owner}/${repo.name}`} className="block h-full">
      <Card className="flex flex-col h-full hover:border-primary transition-colors duration-300">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Book className="w-5 h-5 text-muted-foreground" />
            <span className="truncate">{repo.name}</span>
          </CardTitle>
          <CardDescription className="line-clamp-2 h-[40px]">{repo.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span>{repo.forks}</span>
          </div>
          <span>Updated {repo.updatedAt}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function RepoCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-1/4" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-20" />
      </CardFooter>
    </Card>
  );
}
