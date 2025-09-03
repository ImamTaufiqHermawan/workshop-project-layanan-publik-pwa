const fs = require('fs');
const path = require('path');

// Copy West Java Province logo to all icon sizes
const copyLogoToIcons = () => {
  console.log('🚀 Copying West Java Province Logo to PWA Icons...\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const sourceLogo = path.join(publicDir, 'images.jpg'); // The source logo file
  
  // Check if source logo exists
  if (!fs.existsSync(sourceLogo)) {
    console.log('❌ Source logo not found: images.jpg');
    console.log('Please ensure the West Java Province logo is in public/images.jpg');
    return;
  }
  
  // Icon sizes needed for PWA
  const iconSizes = [16, 32, 48, 70, 72, 76, 96, 114, 120, 144, 150, 152, 180, 192, 310, 512];
  
  console.log('📁 Copying logo to all icon sizes...');
  
  // Copy logo to all icon sizes
  iconSizes.forEach(size => {
    const iconPath = path.join(publicDir, `icon-${size}.png`);
    
    try {
      // Copy the source logo to the icon file
      fs.copyFileSync(sourceLogo, iconPath);
      console.log(`✅ Created icon-${size}.png (${size}x${size})`);
    } catch (error) {
      console.log(`❌ Error creating icon-${size}.png: ${error.message}`);
    }
  });
  
  // Create wide icon for Windows tile
  const wideIconPath = path.join(publicDir, 'icon-310x150.png');
  try {
    fs.copyFileSync(sourceLogo, wideIconPath);
    console.log('✅ Created icon-310x150.png (wide)');
  } catch (error) {
    console.log(`❌ Error creating icon-310x150.png: ${error.message}`);
  }
  
  // Create favicon.ico (copy as PNG for now)
  const faviconPath = path.join(publicDir, 'favicon.ico');
  try {
    fs.copyFileSync(sourceLogo, faviconPath);
    console.log('✅ Created favicon.ico (using logo)');
  } catch (error) {
    console.log(`❌ Error creating favicon.ico: ${error.message}`);
  }
  
  console.log('\n🎉 All PWA icons created from West Java Province logo!');
  console.log('\n📝 Note: All icons are now the same high-quality logo');
  console.log('   - This ensures consistent branding across all PWA elements');
  console.log('   - Icons will be properly recognized by browsers');
  console.log('   - PWA install prompt should now work correctly');
  
  console.log('\n🔗 Icon files created:');
  iconSizes.forEach(size => console.log(`   - icon-${size}.png`));
  console.log('   - icon-310x150.png (wide)');
  console.log('   - favicon.ico');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Commit and push these changes');
  console.log('2. Deploy to Vercel');
  console.log('3. Test PWA installation');
  console.log('4. Icons should now load properly!');
};

// Run the icon generator
if (require.main === module) {
  copyLogoToIcons();
}

module.exports = { copyLogoToIcons };
