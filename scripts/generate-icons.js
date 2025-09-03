const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA and favicon
const iconSizes = [
  16, 32, 48, 70, 72, 76, 96, 114, 120, 144, 150, 152, 180, 192, 310, 512
];

// Create a simple SVG icon as base (since we don't have original icon files)
const createSVGIcon = (size) => {
  const color = '#0ea5e9'; // Theme color
  const strokeWidth = Math.max(2, Math.floor(size / 32));
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size/8}"/>
  <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="white" rx="${size/16}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/8}" fill="${color}"/>
  <text x="${size/2}" y="${size/2 + size/16}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size/4}" font-weight="bold">LP</text>
</svg>`;
};

// Create a simple favicon.ico content (this is a placeholder - real .ico needs proper format)
const createFaviconContent = () => {
  // This is a placeholder - real favicon.ico needs proper ICO format
  return Buffer.from('<!-- Placeholder favicon.ico -->', 'utf8');
};

// Generate all icon files
const generateIcons = () => {
  const publicDir = path.join(__dirname, '..', 'public');
  
  console.log('🚀 Generating PWA icons...');
  
  // Create icon-16.png to icon-512.png
  iconSizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const iconPath = path.join(publicDir, `icon-${size}.png`);
    
    // For now, we'll create SVG files since we can't generate PNG without image processing
    const svgPath = path.join(publicDir, `icon-${size}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    
    console.log(`✅ Created icon-${size}.svg`);
  });
  
  // Create favicon.ico placeholder
  const faviconPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(faviconPath, createFaviconContent());
  console.log('✅ Created favicon.ico (placeholder)');
  
  // Create icon-310x150.png for wide Windows tile
  const wideSVG = `<svg width="310" height="150" viewBox="0 0 310 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="310" height="150" fill="#0ea5e9" rx="18"/>
  <rect x="77" y="37" width="155" height="75" fill="white" rx="9"/>
  <circle cx="155" cy="75" r="19" fill="#0ea5e9"/>
  <text x="155" y="82" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="19" font-weight="bold">LP</text>
</svg>`;
  
  const wideIconPath = path.join(publicDir, 'icon-310x150.svg');
  fs.writeFileSync(wideIconPath, wideSVG);
  console.log('✅ Created icon-310x150.svg');
  
  console.log('\n🎉 All PWA icons generated!');
  console.log('\n📝 Note: These are SVG placeholders. For production, you should:');
  console.log('1. Replace with real PNG icons in the same sizes');
  console.log('2. Use proper favicon.ico format');
  console.log('3. Ensure icons are high quality and represent your brand');
  console.log('\n🔗 Icon sizes created:');
  iconSizes.forEach(size => console.log(`   - icon-${size}.svg`));
  console.log('   - icon-310x150.svg (wide)');
  console.log('   - favicon.ico (placeholder)');
};

// Run the generator
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons, createSVGIcon };
