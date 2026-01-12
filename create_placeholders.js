const fs = require('fs');
const path = require('path');

// Create placeholder images for specific projects
const placeholders = [
  { filename: 'ZK-Anti-Cheat.jpg', title: 'ZK Anti-Cheat' },
  { filename: 'data-analysis.jpg', title: 'Vendor Data Analysis' },
  { filename: 'kindle-monitor.jpg', title: 'Kindle Web Browser' }
];

const publicDir = path.join(__dirname, 'public');

placeholders.forEach(item => {
  const filePath = path.join(publicDir, item.filename);
  
  // Create a simple placeholder SVG and convert to buffer
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#4f46e5"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" fill="white">${item.title}</text>
  </svg>`;
  
  // Convert SVG to Buffer and save as PNG using a simple approach
  // For now, we'll just create the file with SVG content
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder: ${filePath}`);
});