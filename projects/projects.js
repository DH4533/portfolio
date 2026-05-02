import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const titleElement = document.querySelector('.projects-title');

if (projects && titleElement) {
  titleElement.textContent = `${projects.length} Projects`;
}

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1; // for Step 5

function renderPieChart(projectsGiven) {
  // Group data
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  // Generators
  let pie = d3.pie().value(d => d.value);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arcData = pie(data);

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // 🔥 Clear old chart + legend
  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // Draw slices
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .attr('class', selectedIndex === i ? 'selected' : '')
      .on('click', () => {
        // Toggle selection
        selectedIndex = selectedIndex === i ? -1 : i;

        // Re-render everything
        renderPieChart(projectsGiven);
        filterBySelected(projectsGiven, data);
      });
  });

  // Build legend
  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', `legend-item ${selectedIndex === i ? 'selected' : ''}`)
      .html(`
        <span class="swatch"></span>
        ${d.label} <em>(${d.value})</em>
      `)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        renderPieChart(projectsGiven);
        filterBySelected(projectsGiven, data);
      });
  });
}

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects); 
});

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

function filterBySelected(projectsGiven, data) {
  if (selectedIndex === -1) {
    renderProjects(projectsGiven, projectsContainer, 'h2');
  } else {
    let selectedYear = data[selectedIndex].label;

    let filtered = projectsGiven.filter(
      (p) => p.year === selectedYear
    );

    renderProjects(filtered, projectsContainer, 'h2');
  }
}