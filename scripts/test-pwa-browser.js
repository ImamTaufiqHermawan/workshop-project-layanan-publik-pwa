// Test PWA functionality in browser
// Copy this code to browser console to debug PWA issues

const testPWA = () => {
  console.log('🔍 Testing PWA Functionality...\n');
  
  // 1. Check basic PWA requirements
  console.log('📋 Basic PWA Requirements:');
  console.log(`✅ HTTPS: ${location.protocol === 'https:' || location.hostname === 'localhost'}`);
  console.log(`✅ Service Worker: ${'serviceWorker' in navigator}`);
  console.log(`✅ Manifest: ${document.querySelector('link[rel="manifest"]') ? 'Yes' : 'No'}`);
  
  // 2. Check manifest details
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    console.log('\n📱 Manifest Details:');
    fetch(manifestLink.href)
      .then(response => response.json())
      .then(manifest => {
        console.log(`   Name: ${manifest.name}`);
        console.log(`   Display: ${manifest.display}`);
        console.log(`   Icons: ${manifest.icons.length}`);
        console.log(`   Start URL: ${manifest.start_url}`);
        console.log(`   Scope: ${manifest.scope}`);
        
        // Check icon accessibility
        const criticalIcons = manifest.icons.filter(icon => 
          icon.sizes === '192x192' || icon.sizes === '512x512'
        );
        
        console.log('\n🔍 Testing Icon Accessibility:');
        criticalIcons.forEach(icon => {
          fetch(icon.src)
            .then(response => {
              console.log(`   ✅ ${icon.src} (${icon.sizes}): ${response.status} ${response.statusText}`);
            })
            .catch(error => {
              console.log(`   ❌ ${icon.src} (${icon.sizes}): ${error.message}`);
            });
        });
      })
      .catch(error => {
        console.log(`❌ Error fetching manifest: ${error.message}`);
      });
  }
  
  // 3. Check service worker
  if ('serviceWorker' in navigator) {
    console.log('\n🔧 Service Worker Status:');
    navigator.serviceWorker.getRegistration()
      .then(registration => {
        if (registration) {
          console.log(`   ✅ Registered: Yes`);
          console.log(`   ✅ Active: ${registration.active ? 'Yes' : 'No'}`);
          console.log(`   ✅ Waiting: ${registration.waiting ? 'Yes' : 'No'}`);
          console.log(`   ✅ Installing: ${registration.installing ? 'Yes' : 'No'}`);
          console.log(`   ✅ Scope: ${registration.scope}`);
          
          if (registration.active) {
            console.log(`   ✅ SW Script: ${registration.active.scriptURL}`);
          }
        } else {
          console.log(`   ❌ No registration found`);
        }
      })
      .catch(error => {
        console.log(`❌ Error checking SW: ${error.message}`);
      });
  }
  
  // 4. Check PWA installability
  console.log('\n📱 PWA Installability Check:');
  
  // Check if already installed
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = window.navigator.standalone === true;
  console.log(`   ✅ Standalone mode: ${isStandalone || isIOSStandalone}`);
  
  // Check for beforeinstallprompt event
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🎉 beforeinstallprompt event fired!');
    console.log('   Event details:', {
      prompt: typeof e.prompt,
      userChoice: typeof e.userChoice,
      platforms: e.platforms || 'Not available'
    });
    deferredPrompt = e;
  });
  
  // Check for appinstalled event
  window.addEventListener('appinstalled', (e) => {
    console.log('✅ PWA installed successfully!');
    console.log('   Event details:', e);
  });
  
  // 5. Check browser-specific features
  console.log('\n🌐 Browser Information:');
  console.log(`   User Agent: ${navigator.userAgent}`);
  console.log(`   Platform: ${navigator.platform}`);
  console.log(`   Language: ${navigator.language}`);
  
  // 6. Check for common issues
  console.log('\n⚠️  Common Issues Check:');
  
  // Check if in incognito mode
  if (navigator.webdriver) {
    console.log('   ⚠️  Possible incognito/private mode detected');
  }
  
  // Check if page is visible
  if (document.hidden) {
    console.log('   ⚠️  Page is hidden (background tab)');
  }
  
  // Check if user has interacted
  let userInteracted = false;
  const markInteraction = () => { userInteracted = true; };
  document.addEventListener('click', markInteraction);
  document.addEventListener('scroll', markInteraction);
  document.addEventListener('touchstart', markInteraction);
  
  setTimeout(() => {
    console.log(`   ✅ User interaction: ${userInteracted ? 'Yes' : 'No'}`);
  }, 1000);
  
  // 7. Generate test results
  setTimeout(() => {
    console.log('\n🎯 PWA Test Summary:');
    console.log('   - Copy this console output for debugging');
    console.log('   - Check if beforeinstallprompt event fires');
    console.log('   - Verify all icons are accessible');
    console.log('   - Ensure service worker is active');
    console.log('   - Test on different devices/browsers');
  }, 2000);
};

// Auto-run the test
testPWA();

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testPWA };
}
