type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  demo: string;
};

/**
 * Fetches GitHub repositories for a given username
 * @param username GitHub username
 * @returns Array of GitHub repositories
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Add authorization header if GitHub token is available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`, {
      headers,
      // Add cache revalidation to prevent excessive API calls
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const repos = await response.json();
    return repos;
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

/**
 * Maps GitHub repositories to project format
 * @param repos Array of GitHub repositories
 * @returns Array of projects in the required format
 */
export function mapReposToProjects(repos: GitHubRepo[]): Project[] {
  // Define the specific order for priority projects
  const priorityOrder: Record<string, number> = {
    'ZK-Anti-Cheat': 1,  // Top priority
    'vendor-data-analysis': 2,  // Second priority
    'Kindle-web-browser': 3,  // Third priority
  };

  // Separate priority projects from others
  const priorityProjects: Project[] = [];
  const otherProjects: Project[] = [];

  // Map GitHub repos to project format
  repos
    .filter(repo => repo.description) // Only include repos with descriptions
    .forEach(repo => {
      const project: Project = {
        id: repo.id,
        title: repo.name,
        description: repo.description || 'No description provided',
        image: getProjectImage(repo.name),
        technologies: repo.language ? [repo.language, ...repo.topics] : repo.topics,
        github: repo.html_url,
        demo: repo.html_url, // Using GitHub URL as demo since most projects don't have live demos
      };

      if (priorityOrder[repo.name] !== undefined) {
        priorityProjects.push(project);
      } else {
        otherProjects.push(project);
      }
    });

  // Sort priority projects by their priority order
  priorityProjects.sort((a, b) => {
    const priorityA = priorityOrder[a.title] || Number.MAX_SAFE_INTEGER;
    const priorityB = priorityOrder[b.title] || Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });

  // Combine priority projects with other projects
  return [...priorityProjects, ...otherProjects];
}

/**
 * Gets an image URL for a given project name
 * @param projectName Name of the project
 * @returns Image URL
 */
function getProjectImage(projectName: string): string {
  // Define specific images for certain projects
  const projectImages: Record<string, string> = {
    'ZK-Anti-Cheat': '/projects/blockchain.jpg', // Using local image for blockchain/ZK project
    'vendor-data-analysis': '/projects/dataanalysis.jpg', // Using local image for data analysis
    'Kindle-web-browser': '/projects/kindle.jpg', // Using local image for Kindle project
  };

  // Check if we have a specific image for this project
  if (projectImages[projectName]) {
    return projectImages[projectName];
  }

  // Create a consistent hash from the project name to get consistent images
  const hash = Array.from(projectName).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use the hash to select from a predefined set of Unsplash images
  const imageKeywords = [
    'technology',
    'code',
    'programming',
    'computer',
    'laptop',
    'digital',
    'innovation',
    'development',
    'software',
    'data',
    'ai',
    'machine-learning',
    'web-design',
    'creative',
    'modern',
    'blockchain',
    'cryptocurrency',
    'analytics',
    'database',
    'e-reader',
    'tablet'
  ];

  const keywordIndex = Math.abs(hash) % imageKeywords.length;
  const keyword = imageKeywords[keywordIndex];

  // Return a consistent Unsplash image URL based on the project name
  return `https://source.unsplash.com/800x600/?${keyword}&sig=${Math.abs(hash)}`;
}