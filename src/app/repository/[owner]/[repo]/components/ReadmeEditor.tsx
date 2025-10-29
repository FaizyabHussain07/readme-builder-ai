'use client';

import { analyzeRepositoryForReadmeContent } from '@/ai/flows/analyze-repository-for-readme-content';
import { type RepoDetails } from '@/lib/github-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Loader2, Github } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ReadmeEditorProps {
  repoDetails: RepoDetails;
}

const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters long.'),
});

const INITIAL_README_CONTENT = `Click "Generate README" to create your file.\n\nThe AI will generate the following sections based on its analysis of your repository:\n- Title\n- Description\n- Features\n- Tech Stack\n- Setup\n- Usage\n- Contributing\n- License`;

export default function ReadmeEditor({ repoDetails }: ReadmeEditorProps) {
  const [generatedReadme, setGeneratedReadme] = useState(INITIAL_README_CONTENT);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: `Generate a README for a ${repoDetails.language} project. The project is a ${repoDetails.description}.`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedReadme('');

    const apiKey = localStorage.getItem('readme_ai_api_key');
    if (!apiKey) {
      toast({
        variant: 'destructive',
        title: 'API Key Missing',
        description: 'Please add your AI provider API key in the settings.',
      });
      setGeneratedReadme('API key not found. Please add it in the settings dialog.');
      setIsGenerating(false);
      return;
    }

    try {
      const result = await analyzeRepositoryForReadmeContent({
        customPrompt: values.prompt,
        repoName: repoDetails.name,
        repoDescription: repoDetails.description,
        fileStructure: repoDetails.fileStructure,
        programmingLanguages: repoDetails.language || 'Not specified',
        dependencies: repoDetails.dependencies,
        licenseInfo: repoDetails.license,
      }, { apiKey });


      if (!result.readmeContent) {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'The AI failed to generate a README. Please try again.',
        });
        setGeneratedReadme(INITIAL_README_CONTENT);
      } else {
        setGeneratedReadme(result.readmeContent || '');
        toast({
          title: 'README Generated!',
          description: 'Your shiny new README is ready for review.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: error.message || 'Please check your API key and try again later.',
      });
      setGeneratedReadme(INITIAL_README_CONTENT);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleCommit = () => {
    toast({
      title: 'Commit Successful (Mock)',
      description: 'Your README.md has been committed to the repository.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Generate README
          </CardTitle>
          <CardDescription>
            Use the prompt below to guide the AI in generating your README.md file.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Emphasize the data science aspects of the project..."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide specific instructions for the AI to tailor the README.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate README
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            README.md Preview
          </CardTitle>
          <CardDescription>
            Review the generated content. You can edit it here before committing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <br/>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Textarea
              className="min-h-[500px] font-mono text-sm resize-y"
              value={generatedReadme}
              onChange={(e) => setGeneratedReadme(e.target.value)}
            />
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCommit} disabled={isGenerating || generatedReadme === INITIAL_README_CONTENT}>
            <Github className="mr-2 h-4 w-4" />
            Commit to GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
