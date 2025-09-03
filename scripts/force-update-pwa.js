const fs = require('fs');
const path = require('path');

// Force update PWA components for Vercel
const forceUpdatePWA = () => {
  console.log('🚀 Force Updating PWA Components...\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  
  // 1. Update service worker with new cache version
  console.log('🔧 Updating Service Worker...');
  try {
    const swPath = path.join(publicDir, 'service-worker.js');
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Update cache version
    const newCacheVersion = `layanan-publik-v${Date.now()}`;
    swContent = swContent.replace(/const CACHE_NAME = "layanan-publik-v\d+";/, `const CACHE_NAME = "${newCacheVersion}";`);
    
    // Update static cache version
    const newStaticCache = `static-v${Date.now()}`;
    swContent = swContent.replace(/const STATIC_CACHE = "static-v\d+";/, `const STATIC_CACHE = "${newStaticCache}";`);
    
    // Update dynamic cache version
    const newDynamicCache = `dynamic-v${Date.now()}`;
    swContent = swContent.replace(/const DYNAMIC_CACHE = "dynamic-v\d+";/, `const DYNAMIC_CACHE = "${newDynamicCache}";`);
    
    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Service Worker updated with new cache versions`);
    console.log(`   Cache: ${newCacheVersion}`);
    console.log(`   Static: ${newStaticCache}`);
    console.log(`   Dynamic: ${newDynamicCache}`);
    
  } catch (error) {
    console.log(`❌ Error updating service worker: ${error.message}`);
  }
  
  // 2. Update manifest.json with timestamp
  console.log('\n📱 Updating Manifest...');
  try {
    const manifestPath = path.join(publicDir, 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Add timestamp to force update
    manifest.version = `1.0.${Date.now()}`;
    manifest.timestamp = new Date().toISOString();
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest updated with version: ${manifest.version}`);
    
  } catch (error) {
    console.log(`❌ Error updating manifest: ${error.message}`);
  }
  
  // 3. Create cache-busting files
  console.log('\n🗑️  Creating Cache-Busting Files...');
  try {
    // Create a cache-busting HTML file
    const cacheBusterHTML = `<!DOCTYPE html>
<html>
<head>
    <title>PWA Cache Buster</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>PWA Cache Buster</h1>
    <p>Generated at: ${new Date().toISOString()}</p>
    <p>This file forces browser to reload PWA components</p>
    <script>
        // Force reload after 2 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    </script>
</body>
</html>`;
    
    const cacheBusterPath = path.join(publicDir, 'cache-buster.html');
    fs.writeFileSync(cacheBusterPath, cacheBusterHTML);
    console.log('✅ Created cache-buster.html');
    
    // Create a cache-busting JS file
    const cacheBusterJS = `// PWA Cache Buster - Generated at ${new Date().toISOString()}
console.log('PWA Cache Buster loaded - forcing update...');

// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      registration.update();
      console.log('Service Worker update forced');
    }
  });
}

// Clear caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
      console.log('Cache cleared:', cacheName);
    });
  });
}`;
    
    const cacheBusterJSPath = path.join(publicDir, 'cache-buster.js');
    fs.writeFileSync(cacheBusterJSPath, cacheBusterJS);
    console.log('✅ Created cache-buster.js');
    
  } catch (error) {
    console.log(`❌ Error creating cache-busting files: ${error.message}`);
  }
  
  // 4. Update vercel.json for better caching
  console.log('\n⚙️  Updating Vercel Configuration...');
  try {
    const vercelPath = path.join(__dirname, '..', 'vercel.json');
    let vercelContent = fs.readFileSync(vercelPath, 'utf8');
    const vercel = JSON.parse(vercelContent);
    
    // Add cache-busting headers
    if (!vercel.headers) vercel.headers = [];
    
    // Add cache-busting for PWA files
    const pwaHeaders = [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      },
      {
        source: "/service-worker.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      },
      {
        source: "/icon-*.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
    
    // Merge headers
    vercel.headers = [...vercel.headers, ...pwaHeaders];
    
    fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2));
    console.log('✅ Vercel config updated with cache-busting headers');
    
  } catch (error) {
    console.log(`❌ Error updating vercel.json: ${error.message}`);
  }
  
  // 5. Generate deployment instructions
  console.log('\n📋 Deployment Instructions:');
  console.log('1. Commit and push these changes');
  console.log('2. Deploy to Vercel');
  console.log('3. Clear browser cache completely');
  console.log('4. Test PWA installation');
  console.log('5. If still not working, check browser console for errors');
  
  console.log('\n🔍 Troubleshooting Steps:');
  console.log('- Clear all browser data (cookies, cache, service workers)');
  console.log('- Test in incognito/private mode');
  console.log('- Check if icons are accessible via direct URL');
  console.log('- Verify service worker registration in DevTools');
  console.log('- Test on different devices/browsers');
  
  console.log('\n🎯 Key Differences Local vs Vercel:');
  console.log('- Local: No CDN caching, direct file access');
  console.log('- Vercel: CDN caching, potential file access issues');
  console.log('- Local: HTTP allowed for PWA testing');
  console.log('- Vercel: HTTPS required, strict PWA rules');
  console.log('- Local: No service worker version conflicts');
  console.log('- Vercel: Service worker caching can cause issues');
};

// Run the force update
if (require.main === module) {
  forceUpdatePWA();
}

module.exports = { forceUpdatePWA };
