import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Fetch all projects
const projects = await fetchJSON('./lib/projects.json');

// Get first 3 projects
const latestProjects = projects?.slice(0, 3);

// Select container on homepage
const projectsContainer = document.querySelector('.projects');

// Render them
renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('DH4533');

const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}