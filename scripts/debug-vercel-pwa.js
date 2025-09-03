const fs = require('fs');
const path = require('path');

// Debug PWA issues on Vercel
const debugVercelPWA = () => {
  console.log('🔍 Debugging PWA Issues on Vercel...\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Check if all required files exist
  const requiredFiles = [
    'manifest.json',
    'service-worker.js',
    'icon-192.png',
    'icon-512.png',
    'favicon.ico'
  ];
  
  console.log('📁 Checking required PWA files:');
  requiredFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${file} (${stats.size} bytes)`);
    } else {
      console.log(`❌ ${file} - MISSING!`);
    }
  });
  
  // Check manifest.json content
  console.log('\n📋 Checking manifest.json:');
  try {
    const manifestPath = path.join(publicDir, 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    console.log(`✅ Manifest name: ${manifest.name}`);
    console.log(`✅ Display mode: ${manifest.display}`);
    console.log(`✅ Icons count: ${manifest.icons.length}`);
    
    // Check if icons reference PNG files
    const hasPNGIcons = manifest.icons.every(icon => 
      icon.src.endsWith('.png') && icon.type === 'image/png'
    );
    console.log(`✅ PNG icons: ${hasPNGIcons ? 'Yes' : 'No'}`);
    
    // Check critical icon sizes
    const criticalSizes = ['192x192', '512x512'];
    const hasCriticalSizes = criticalSizes.every(size => 
      manifest.icons.some(icon => icon.sizes === size)
    );
    console.log(`✅ Critical sizes (192x192, 512x512): ${hasCriticalSizes ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.log(`❌ Error reading manifest: ${error.message}`);
  }
  
  // Check service worker
  console.log('\n🔧 Checking service worker:');
  try {
    const swPath = path.join(publicDir, 'service-worker.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    // Check if SW references correct icons
    const hasIcon192 = swContent.includes('icon-192.png');
    const hasIcon512 = swContent.includes('icon-512.png');
    
    console.log(`✅ References icon-192.png: ${hasIcon192 ? 'Yes' : 'No'}`);
    console.log(`✅ References icon-512.png: ${hasIcon512 ? 'Yes' : 'No'}`);
    
    // Check for potential issues
    if (swContent.includes('icon-192.svg') || swContent.includes('icon-512.svg')) {
      console.log('⚠️  WARNING: Service worker still references SVG icons!');
    }
    
  } catch (error) {
    console.log(`❌ Error reading service worker: ${error.message}`);
  }
  
  // Check vercel.json
  console.log('\n⚙️  Checking vercel.json:');
  try {
    const vercelPath = path.join(__dirname, '..', 'vercel.json');
    if (fs.existsSync(vercelPath)) {
      const vercelContent = fs.readFileSync(vercelPath, 'utf8');
      const vercel = JSON.parse(vercelContent);
      
      console.log(`✅ Vercel config exists`);
      if (vercel.headers) {
        console.log(`✅ Has custom headers`);
        vercel.headers.forEach(header => {
          if (header.source.includes('manifest') || header.source.includes('service-worker')) {
            console.log(`   📋 ${header.source} → ${header.headers['Cache-Control'] || 'No cache control'}`);
          }
        });
      }
    } else {
      console.log('❌ vercel.json not found');
    }
  } catch (error) {
    console.log(`❌ Error reading vercel.json: ${error.message}`);
  }
  
  // Generate troubleshooting steps
  console.log('\n🚀 Troubleshooting Steps for Vercel:');
  console.log('1. Clear Vercel cache and redeploy');
  console.log('2. Check if all PNG icons are accessible via URL');
  console.log('3. Verify service worker registration in browser console');
  console.log('4. Check if beforeinstallprompt event fires');
  console.log('5. Ensure HTTPS is working properly');
  console.log('6. Test on different devices/browsers');
  
  console.log('\n💡 Common Vercel PWA Issues:');
  console.log('- CDN caching of old service worker');
  console.log('- Icon files not accessible');
  console.log('- HTTPS/SSL configuration');
  console.log('- Browser cache of old manifest');
  console.log('- Service worker scope issues');
};

// Run the debugger
if (require.main === module) {
  debugVercelPWA();
}

module.exports = { debugVercelPWA };
