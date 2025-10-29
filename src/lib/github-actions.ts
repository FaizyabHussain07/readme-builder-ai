'use server';

import { getGitHubAccessToken } from '@/lib/github-data';
import { revalidatePath } from 'next/cache';

interface CommitReadmeParams {
  owner: string;
  repo: string;
  content: string;
}

export async function commitReadmeToGitHub(params: CommitReadmeParams): Promise<{ success: boolean; error?: string; url?: string; }> {
  const { owner, repo, content } = params;
  const accessToken = await getGitHubAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Authentication failed. Please log in again.' };
  }

  const commitMessage = 'docs: Generate README.md via ReadmeAI Builder';
  const readmePath = 'README.md';
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${readmePath}`;

  try {
    // Step 1: Check if README.md already exists to get its SHA
    let currentSha: string | undefined;
    try {
      const getResponse = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        currentSha = fileData.sha;
      } else if (getResponse.status !== 404) {
         // Handle errors other than "not found"
        const errorData = await getResponse.json();
        return { success: false, error: `Failed to check for existing README: ${errorData.message}` };
      }
    } catch (e) {
        // Ignore fetch error, could be due to file not existing.
    }


    // Step 2: Create or update the file
    const body = {
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      sha: currentSha, // Include SHA if updating an existing file
    };

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(body),
    });

    const responseData = await putResponse.json();

    if (putResponse.ok) {
        // Revalidate the path to show fresh data if the user navigates back
        revalidatePath(`/repository/${owner}/${repo}`);
        return { success: true, url: responseData.commit.html_url };
    } else {
        return { success: false, error: responseData.message || 'An unknown error occurred while committing the file.' };
    }
  } catch (error: any) {
    console.error('Error committing to GitHub:', error);
    return { success: false, error: error.message || 'Failed to commit to GitHub.' };
  }
}
