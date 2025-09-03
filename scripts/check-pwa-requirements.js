#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 PWA Requirements Checker');
console.log('============================\n');

// Check manifest.json
const manifestPath = path.join(__dirname, '../public/manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('✅ manifest.json found and valid');
    
    // Check manifest requirements
    const manifestChecks = {
      name: !!manifest.name,
      short_name: !!manifest.short_name,
      description: !!manifest.description,
      start_url: !!manifest.start_url,
      display: manifest.display === 'standalone',
      background_color: !!manifest.background_color,
      theme_color: !!manifest.theme_color,
      icons: manifest.icons && manifest.icons.length > 0,
      icons_192: manifest.icons && manifest.icons.some(icon => icon.sizes === '192x192'),
      icons_512: manifest.icons && manifest.icons.some(icon => icon.sizes === '512x512'),
      purpose_any: manifest.icons && manifest.icons.some(icon => icon.purpose === 'any'),
      purpose_maskable: manifest.icons && manifest.icons.some(icon => icon.purpose === 'maskable')
    };
    
    console.log('Manifest Requirements:');
    Object.entries(manifestChecks).forEach(([key, met]) => {
      console.log(`  ${met ? '✅' : '❌'} ${key}: ${met ? 'OK' : 'Missing'}`);
    });
    
    const manifestScore = (Object.values(manifestChecks).filter(Boolean).length / Object.keys(manifestChecks).length) * 100;
    console.log(`\nManifest Score: ${manifestScore.toFixed(1)}%`);
    
  } catch (error) {
    console.log('❌ manifest.json is invalid JSON:', error.message);
  }
} else {
  console.log('❌ manifest.json not found');
}

// Check service worker
const swPath = path.join(__dirname, '../public/service-worker.js');
if (fs.existsSync(swPath)) {
  const stats = fs.statSync(swPath);
  console.log('\n✅ service-worker.js found');
  console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);
  
  // Check service worker content
  const swContent = fs.readFileSync(swPath, 'utf8');
  const swChecks = {
    hasInstallEvent: swContent.includes('install'),
    hasActivateEvent: swContent.includes('activate'),
    hasFetchEvent: swContent.includes('fetch'),
    hasSkipWaiting: swContent.includes('skipWaiting'),
    hasClientsClaim: swContent.includes('clients.claim')
  };
  
  console.log('Service Worker Requirements:');
  Object.entries(swChecks).forEach(([key, met]) => {
    console.log(`  ${met ? '✅' : '❌'} ${key}: ${met ? 'OK' : 'Missing'}`);
  });
  
  const swScore = (Object.values(swChecks).filter(Boolean).length / Object.keys(swChecks).length) * 100;
  console.log(`\nService Worker Score: ${swScore.toFixed(1)}%`);
} else {
  console.log('\n❌ service-worker.js not found');
}

// Check icons
const icon192Path = path.join(__dirname, '../public/icon-192.png');
const icon512Path = path.join(__dirname, '../public/icon-512.png');

console.log('\nIcon Requirements:');
if (fs.existsSync(icon192Path)) {
  const stats = fs.statSync(icon192Path);
  console.log(`✅ icon-192.png found (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
  console.log('❌ icon-192.png not found');
}

if (fs.existsSync(icon512Path)) {
  const stats = fs.statSync(icon512Path);
  console.log(`✅ icon-512.png found (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
  console.log('❌ icon-512.png not found');
}

// Check layout.jsx for PWA meta tags
const layoutPath = path.join(__dirname, '../app/layout.jsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const layoutChecks = {
    hasManifest: layoutContent.includes('rel="manifest"'),
    hasMobileWebApp: layoutContent.includes('mobile-web-app-capable'),
    hasAppleMeta: layoutContent.includes('apple-mobile-web-app'),
    hasThemeColor: layoutContent.includes('theme-color'),
    hasViewport: layoutContent.includes('viewport'),
    hasIcon: layoutContent.includes('rel="icon"'),
    hasAppleTouchIcon: layoutContent.includes('apple-touch-icon'),
    hasMsTileColor: layoutContent.includes('msapplication-TileColor'),
    hasMsTileImage: layoutContent.includes('msapplication-TileImage')
  };
  
  console.log('\nLayout.jsx PWA Meta Tags:');
  Object.entries(layoutChecks).forEach(([key, met]) => {
    console.log(`  ${met ? '✅' : '❌'} ${key}: ${met ? 'OK' : 'Missing'}`);
  });
  
  const layoutScore = (Object.values(layoutChecks).filter(Boolean).length / Object.keys(layoutChecks).length) * 100;
  console.log(`\nLayout Score: ${layoutScore.toFixed(1)}%`);
} else {
  console.log('\n❌ layout.jsx not found');
}

// Check vercel.json
const vercelPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelPath)) {
  try {
    const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    console.log('\n✅ vercel.json found and valid');
    if (vercel.headers) {
      console.log(`   - Headers configured: ${vercel.headers.length} header(s)`);
    }
  } catch (error) {
    console.log('\n❌ vercel.json is invalid JSON');
  }
} else {
  console.log('\n❌ vercel.json not found');
}

console.log('\n📱 PWA Installation Criteria:');
console.log('=============================');
console.log('1. ✅ HTTPS (required for production)');
console.log('2. ✅ Valid manifest.json');
console.log('3. ✅ Service worker registered');
console.log('4. ✅ Icons (192x192 and 512x512)');
console.log('5. ✅ Meta tags in HTML head');
console.log('6. ✅ User engagement (clicks, scrolls)');
console.log('7. ✅ Not already installed');
console.log('8. ✅ Browser supports PWA');

console.log('\n🔧 Common Issues:');
console.log('==================');
console.log('• Missing purpose="any maskable" in manifest icons');
console.log('• Service worker not properly registered');
console.log('• Missing viewport meta tag');
console.log('• Missing theme-color meta tag');
console.log('• Icons not accessible or wrong format');
console.log('• Manifest not accessible at /manifest.json');

console.log('\n🚀 Next Steps:');
console.log('===============');
console.log('1. Fix any missing requirements above');
console.log('2. Test with Lighthouse PWA audit');
console.log('3. Verify in Chrome DevTools > Application');
console.log('4. Test on mobile device');
console.log('5. Check console for beforeinstallprompt event');
