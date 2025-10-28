import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import Logo from '@/components/icons/Logo';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-background">
      <div className="max-w-3xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Logo className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
          ReadmeAI Builder
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
          Effortlessly generate professional README files for your GitHub repositories using the power of AI.
          Connect your GitHub account and let's get started.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="font-bold text-lg">
            <Link href="/dashboard">
              <Github className="mr-2 h-5 w-5" />
              Login with GitHub
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          By logging in, you agree to our imaginary Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
