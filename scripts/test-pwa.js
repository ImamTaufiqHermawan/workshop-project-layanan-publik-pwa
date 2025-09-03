#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 PWA Configuration Checker');
console.log('=============================\n');

// Check manifest.json
const manifestPath = path.join(__dirname, '../public/manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('✅ manifest.json found and valid');
    console.log(`   - Name: ${manifest.name}`);
    console.log(`   - Short Name: ${manifest.short_name}`);
    console.log(`   - Display: ${manifest.display}`);
    console.log(`   - Start URL: ${manifest.start_url}`);
    console.log(`   - Icons: ${manifest.icons.length} icon(s)`);
  } catch (error) {
    console.log('❌ manifest.json is invalid JSON');
  }
} else {
  console.log('❌ manifest.json not found');
}

// Check service worker
const swPath = path.join(__dirname, '../public/service-worker.js');
if (fs.existsSync(swPath)) {
  const stats = fs.statSync(swPath);
  console.log('✅ service-worker.js found');
  console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('❌ service-worker.js not found');
}

// Check icons
const icon192Path = path.join(__dirname, '../public/icon-192.png');
const icon512Path = path.join(__dirname, '../public/icon-512.png');

if (fs.existsSync(icon192Path)) {
  console.log('✅ icon-192.png found');
} else {
  console.log('❌ icon-192.png not found');
}

if (fs.existsSync(icon512Path)) {
  console.log('✅ icon-512.png found');
} else {
  console.log('❌ icon-512.png not found');
}

// Check layout.jsx for PWA meta tags
const layoutPath = path.join(__dirname, '../app/layout.jsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const hasManifest = layoutContent.includes('rel="manifest"');
  const hasMobileWebApp = layoutContent.includes('mobile-web-app-capable');
  const hasAppleMeta = layoutContent.includes('apple-mobile-web-app');
  
  console.log('✅ layout.jsx PWA meta tags:');
  console.log(`   - Manifest link: ${hasManifest ? '✅' : '❌'}`);
  console.log(`   - Mobile web app capable: ${hasMobileWebApp ? '✅' : '❌'}`);
  console.log(`   - Apple meta tags: ${hasAppleMeta ? '✅' : '❌'}`);
} else {
  console.log('❌ layout.jsx not found');
}

// Check vercel.json
const vercelPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelPath)) {
  try {
    const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    console.log('✅ vercel.json found and valid');
    if (vercel.headers) {
      console.log(`   - Headers configured: ${vercel.headers.length} header(s)`);
    }
  } catch (error) {
    console.log('❌ vercel.json is invalid JSON');
  }
} else {
  console.log('❌ vercel.json not found');
}

console.log('\n📱 PWA Testing Instructions:');
console.log('============================');
console.log('1. Start development server: npm run dev');
console.log('2. Open Chrome DevTools > Application tab');
console.log('3. Check Manifest section for PWA details');
console.log('4. Check Service Workers section for registration');
console.log('5. Use Lighthouse to audit PWA score');
console.log('6. Test on mobile device or Chrome mobile emulation');
console.log('7. Look for "Add to Home Screen" prompt');

console.log('\n🔧 Common Issues & Solutions:');
console.log('==============================');
console.log('• Button not showing: Check console for beforeinstallprompt event');
console.log('• HTTPS required: PWA needs HTTPS in production');
console.log('• Service worker: Must be served from root domain');
console.log('• Manifest: Must be accessible at /manifest.json');
console.log('• Icons: Must be accessible and valid PNG files');
console.log('• Browser support: Chrome, Edge, Safari support PWA');

console.log('\n🚀 Deployment Checklist:');
console.log('=======================');
console.log('□ Ensure HTTPS is enabled on Vercel');
console.log('□ Verify manifest.json is accessible');
console.log('□ Verify service-worker.js is accessible');
console.log('□ Test on mobile device');
console.log('□ Check Lighthouse PWA score');
console.log('□ Verify install prompt appears');
console.log('□ Test offline functionality');
