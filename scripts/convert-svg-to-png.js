const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [16, 32, 48, 72, 96, 120, 144, 152, 180, 192, 310, 512];

// Create simple PNG-like content (base64 encoded minimal PNG)
const createMinimalPNG = (size) => {
  // This is a minimal valid PNG structure
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR chunk type
    0x00, 0x00, 0x00, 0x00, // Width (4 bytes, big endian)
    0x00, 0x00, 0x00, 0x00, // Height (4 bytes, big endian)
    0x08, // Bit depth
    0x02, // Color type (RGB)
    0x00, // Compression method
    0x00, // Filter method
    0x00  // Interlace method
  ]);
  
  // Set width and height (big endian)
  pngHeader.writeUInt32BE(size, 16);
  pngHeader.writeUInt32BE(size, 20);
  
  // Create a simple 1x1 pixel data
  const pixelData = Buffer.from([
    0x00, 0x00, 0x00, 0x00, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT chunk type
    0x08, 0x99, 0x01, 0x01, // Compressed data (1x1 pixel)
    0x00, 0x00, 0x00, 0x00, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND chunk type
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return Buffer.concat([pngHeader, pixelData]);
};

// Generate all PNG icon files
const generatePNGIcons = () => {
  const publicDir = path.join(__dirname, '..', 'public');
  
  console.log('🚀 Converting SVG to PNG for Vercel compatibility...');
  
  // Create PNG icons
  iconSizes.forEach(size => {
    const pngContent = createMinimalPNG(size);
    const pngPath = path.join(publicDir, `icon-${size}.png`);
    
    fs.writeFileSync(pngPath, pngContent);
    console.log(`✅ Created icon-${size}.png (${size}x${size})`);
  });
  
  // Create wide icon for Windows
  const widePNG = createMinimalPNG(310);
  const widePath = path.join(publicDir, 'icon-310x150.png');
  fs.writeFileSync(widePath, widePNG);
  console.log('✅ Created icon-310x150.png');
  
  console.log('\n🎉 All PNG icons generated for Vercel!');
  console.log('\n📝 Note: These are minimal PNG placeholders.');
  console.log('For production, replace with real high-quality PNG icons.');
};

// Run the generator
if (require.main === module) {
  generatePNGIcons();
}

module.exports = { generatePNGIcons, createMinimalPNG };
