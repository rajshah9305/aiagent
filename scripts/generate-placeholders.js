const fs = require('fs');
const path = require('path');

// Create the agents directory if it doesn't exist
const agentsDir = path.join(__dirname, '../public/images/agents');
if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

// Agent placeholder data
const agents = [
  { id: 'saul', name: 'Better Call Saul', color: '#2C3E50' },
  { id: 'sheldon', name: 'SheldonGPT', color: '#3498DB' },
  { id: 'wolf', name: 'Wolf of Wall Street', color: '#E74C3C' },
  { id: 'jarvis', name: 'Jarvis', color: '#9B59B6' },
  { id: 'q', name: 'Q', color: '#16A085' }
];

// Generate SVG placeholder for each agent
agents.forEach(agent => {
  const initials = agent.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${agent.color}" />
    <text x="100" y="115" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
  </svg>`;

  fs.writeFileSync(path.join(agentsDir, `${agent.id}.svg`), svg);
  console.log(`Generated placeholder for ${agent.name}`);
});

console.log('All placeholders generated successfully!');
