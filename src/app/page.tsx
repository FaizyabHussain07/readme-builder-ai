
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Github,
  Bot,
  FileText,
  Settings2,
  GitCommit,
  Star,
  Download,
  GitBranch,
  BookCheck,
  Rocket,
  Cpu,
} from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    provider.addScope('user');
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with GitHub: ", error);
    }
  };


  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Generation',
      description:
        'Leverage powerful AI models to generate well-structured and comprehensive READMEs in seconds.',
    },
    {
      icon: <Settings2 className="h-8 w-8 text-primary" />,
      title: 'Repository Analysis',
      description:
        'Automatically analyze your repository to extract languages, dependencies, and file structures.',
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Customizable Templates',
      description:
        'Start with a smart template and customize it to perfectly fit your project\'s needs.',
    },
    {
      icon: <GitCommit className="h-8 w-8 text-primary" />,
      title: 'Direct-to-GitHub',
      description:
        'Commit your newly generated README directly to your repository without leaving the app.',
    },
  ];

  const providers = [
    { name: 'Gemini' },
    { name: 'OpenAI' },
    { name: 'Groq' },
    { name: 'OpenRouter' },
  ];

  const steps = [
    {
      step: 1,
      title: 'Connect Your GitHub',
      description: 'Sign in with your GitHub account to access your public repositories.',
      icon: <GitBranch className="h-12 w-12 text-primary" />,
    },
    {
      step: 2,
      title: 'Select a Repository',
      description:
        'Choose the repository you want to create a README for from a list of your projects.',
      icon: <BookCheck className="h-12 w-12 text-primary" />,
    },
    {
      step: 3,
      title: 'Generate & Refine',
      description:
        'Let the AI generate a draft, then edit and customize the content in the live editor.',
      icon: <Rocket className="h-12 w-12 text-primary" />,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah D.',
      role: 'Frontend Developer',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      comment:
        'ReadmeAI Builder saved me hours! I used to dread writing documentation, but now it\'s a breeze. The AI-generated content is surprisingly accurate and well-written.',
    },
    {
      name: 'Mike L.',
      role: 'Open Source Contributor',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
      comment:
        'As someone who maintains multiple open-source projects, this tool is a lifesaver. It helps me create consistent and professional READMEs across all my repositories.',
    },
    {
      name: 'Alex C.',
      role: 'Data Scientist',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
      comment:
        'I love how it analyzes my Python scripts and suggests relevant sections. It understands the context of my data science projects perfectly.',
    },
  ];

  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Logo className="h-16 w-16 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
            ReadmeAI Builder
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Effortlessly generate professional README files for your GitHub repositories using the power of AI. Connect your GitHub account and let's get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {loading ? (
              <Button size="lg" className="font-bold text-lg" disabled>
                Loading...
              </Button>
            ) : user ? (
               <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="font-bold text-lg" onClick={handleLogin}>
                <Github className="mr-2 h-5 w-5" />
                Login with GitHub
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Why You'll Love ReadmeAI Builder
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Everything you need to create the perfect README.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-headline text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Providers Section */}
      <section id="providers" className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Powered by Multiple AI Providers</h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Use your preferred AI provider with free model options available.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center justify-center gap-3 p-6 rounded-lg bg-card border hover:border-primary transition-colors">
                <Cpu className="h-6 w-6 text-muted-foreground" />
                <span className="text-lg font-semibold">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Create Your README in 3 Simple Steps
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Go from repository to a polished README in minutes.
            </p>
          </div>
          <div className="relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" style={{top: '4rem'}}></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {steps.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-primary/10 mb-6 border-4 border-background">
                       {step.icon}
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Loved by Developers Worldwide
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Don't just take our word for it. Here's what people are saying.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col justify-between bg-card">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground">"{testimonial.comment}"</p>
                  </CardContent>
                </CardHeader>
                <div className="p-6 pt-0 flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* From the Creator Section */}
      <section id="creator" className="py-20 bg-card">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            From a Developer, For Developers
          </h2>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-8 bg-background p-8 rounded-lg border">
              <Avatar className="h-32 w-32">
                  <AvatarImage src="/faizyab.jpeg" alt="Faizyab Hussain" />
                  <AvatarFallback>FH</AvatarFallback>
              </Avatar>
              <div className="text-left">
                  <p className="text-muted-foreground mb-4">
                      "As a developer, I spent countless hours writing and rewriting READMEs. It's a crucial but often tedious part of any project. I built ReadmeAI Builder to scratch my own itch—to automate the boring parts of documentation so we can all focus on what we love: coding. My goal is to help developers like myself create beautiful, effective READMEs with minimal effort."
                  </p>
                  <div className="font-semibold">
                      <p>Faizyab Hussain, Creator of ReadmeAI Builder</p>
                      <a 
                          href="https://www.linkedin.com/in/faizyabhussain/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline text-sm"
                      >
                          Connect on LinkedIn
                      </a>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
            Ready to Supercharge Your Docs?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Stop procrastinating on documentation. Generate your first README for free, right now.
          </p>
          {loading ? null : user ? (
            <Button asChild size="lg" className="font-bold text-lg">
              <Link href="/dashboard">
                <Rocket className="mr-2 h-5 w-5" />
                Start Generating
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="font-bold text-lg" onClick={handleLogin}>
              <Github className="mr-2 h-5 w-5" />
              Get Started with GitHub
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ReadmeAI Builder. All rights reserved.</p>
          <p className="text-sm mt-2">
            Built by{' '}
            <a
              href="https://www.linkedin.com/in/faizyabhussain/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Faizyab Hussain
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
