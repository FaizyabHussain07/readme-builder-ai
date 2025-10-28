# **App Name**: ReadmeAI Builder

## Core Features:

- GitHub OAuth Authentication: Securely authenticate users using GitHub OAuth 2.0 to access their repositories.
- Repository Fetch and Display: Fetch a list of user repositories from GitHub and display them in a user-friendly interface, including details like name, stars, forks, and language.
- AI-Powered README Generation: Automatically generate README.md content using AI based on repository analysis and user-provided prompts. The tool will include title, description, features, tech stack, setup, usage, contributing, and license.
- Repository Analysis: Analyze repository contents to extract key information such as file structure, programming languages, dependencies, and license information for AI-driven README generation.
- Custom Prompt Input: Allow users to input custom prompts to guide the AI in generating README content, tailoring it to their specific needs and preferences.
- README Preview: Display a preview of the AI-generated README.md content, allowing users to review and approve the generated content or regenerate with a modified prompt before committing.
- GitHub Commit Integration: Commit the generated README.md file to the user's GitHub repository via the GitHub API with a standardized commit message, streamlining the process of updating the repository documentation.
- AI Provider Selection and API Key Usage: Allow user to select AI provider, input and save API key, and use the free model of the selected AI provider using the provided API key.

## Style Guidelines:

- Primary color: Deep blue (#2E3192) to evoke trust and professionalism, suitable for a developer tool.
- Background color: Light gray (#F0F2F5), providing a clean and unobtrusive backdrop for the interface.
- Accent color: Bright cyan (#00FFFF), used sparingly for interactive elements and calls to action.
- Headline font: 'Space Grotesk', sans-serif, to convey a modern and technical aesthetic, also for shorter pieces of body text; but if longer text is anticipated, choose 'Inter' for body text.
- Use a consistent set of line icons from a library like Feather or Font Awesome, styled in the accent color.
- Implement a clean, card-based layout for displaying repositories and options, with clear visual hierarchy.
- Subtle transitions and animations to enhance user experience, such as smooth loading indicators and button hover effects.