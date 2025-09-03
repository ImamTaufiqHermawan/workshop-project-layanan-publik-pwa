"use client";

import { useState, useEffect } from "react";

export default function PWADebugInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [pwaStatus, setPwaStatus] = useState({});
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Comprehensive PWA status check
    const checkPWAStatus = () => {
      const status = {
        // Basic requirements
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost',
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        
        // Manifest details
        manifestUrl: document.querySelector('link[rel="manifest"]')?.href,
        manifestAccessible: false,
        
        // Service worker details
        swRegistered: false,
        swActive: false,
        
        // Icon details
        hasIcons: false,
        icon192: false,
        icon512: false,
        
        // Browser support
        isChrome: /Chrome/.test(navigator.userAgent),
        isEdge: /Edg/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        isMobile: /Android|iPhone|iPad|iPod/.test(navigator.userAgent),
        
        // Display mode
        displayMode: 'browser',
        isStandalone: false,
        
        // User engagement
        hasUserEngagement: false
      };

      // Check manifest accessibility
      if (status.manifestUrl) {
        fetch(status.manifestUrl)
          .then(response => {
            status.manifestAccessible = response.ok;
            return response.json();
          })
          .then(manifest => {
            status.hasIcons = manifest.icons && manifest.icons.length > 0;
            status.icon192 = manifest.icons && manifest.icons.some(icon => icon.sizes === '192x192');
            status.icon512 = manifest.icons && manifest.icons.some(icon => icon.sizes === '512x512');
            status.displayMode = manifest.display || 'browser';
            setPwaStatus(status);
          })
          .catch(() => {
            status.manifestAccessible = false;
            setPwaStatus(status);
          });
      }

      // Check service worker status
      if (status.hasServiceWorker) {
        navigator.serviceWorker.getRegistration()
          .then(registration => {
            if (registration) {
              status.swRegistered = true;
              status.swActive = !!registration.active;
              setPwaStatus(status);
            }
          })
          .catch(() => {
            setPwaStatus(status);
          });
      }

      // Check display mode
      status.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      setPwaStatus(status);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 beforeinstallprompt event captured:', e);
      
      // Validate this is a real event
      if (e && typeof e.prompt === 'function' && typeof e.userChoice === 'object') {
        console.log('✅ Valid beforeinstallprompt event detected');
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallButton(true);
        setDebugInfo('Install prompt asli tersedia!');
      } else {
        console.log('❌ Invalid beforeinstallprompt event');
        setDebugInfo('Event tidak valid - bukan event asli browser');
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      setDebugInfo('PWA berhasil diinstall!');
    };

    checkIfInstalled();
    checkPWAStatus();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check user engagement
    let engagementCount = 0;
    const handleUserEngagement = () => {
      engagementCount++;
      if (engagementCount >= 3) {
        setPwaStatus(prev => ({ ...prev, hasUserEngagement: true }));
      }
    };

    window.addEventListener('click', handleUserEngagement);
    window.addEventListener('scroll', handleUserEngagement);
    window.addEventListener('touchstart', handleUserEngagement);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('click', handleUserEngagement);
      window.removeEventListener('scroll', handleUserEngagement);
      window.removeEventListener('touchstart', handleUserEngagement);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt && typeof deferredPrompt.prompt === 'function') {
      try {
        console.log('🚀 Showing native install prompt...');
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install outcome:', outcome);
        
        if (outcome === 'accepted') {
          setShowInstallButton(false);
          setDeferredPrompt(null);
          setDebugInfo('User menerima install prompt');
        } else {
          setDebugInfo('User menolak install prompt');
        }
      } catch (error) {
        console.error('Native install error:', error);
        setDebugInfo('Error saat install prompt');
      }
    } else {
      console.log('❌ No valid deferred prompt available');
      setDebugInfo('Install prompt tidak valid');
    }
  };

  const handleManualInstall = () => {
    const userAgent = navigator.userAgent;
    let instructions = '';
    
    if (/Android/i.test(userAgent)) {
      instructions = `Untuk menginstall PWA di Android:\n\n` +
        `1. Tap menu ⋮ (3 titik) di Chrome\n` +
        `2. Pilih "Install app" atau "Add to Home screen"\n` +
        `3. Tap "Install" atau "Add"\n\n` +
        `Atau tunggu banner "Install app" yang muncul otomatis.`;
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      instructions = `Untuk menginstall PWA di iOS:\n\n` +
        `1. Tap tombol Share 📤 di Safari\n` +
        `2. Scroll ke bawah dan pilih "Add to Home Screen"\n` +
        `3. Tap "Add"\n\n` +
        `PWA akan muncul di home screen.`;
    } else {
      instructions = `Untuk menginstall PWA:\n\n` +
        `1. Buka menu browser Anda\n` +
        `2. Cari opsi "Install app" atau "Add to Home screen"\n` +
        `3. Ikuti instruksi yang muncul`;
    }
    
    alert(instructions);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleForceSWRegister = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);
        setDebugInfo('Service Worker berhasil di-register ulang');
        
        // Force update
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setDebugInfo('Gagal register Service Worker: ' + error.message);
      }
    }
  };

  // Don't show anything if PWA is installed
  if (isInstalled) {
    return (
      <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-800 text-sm font-medium">PWA sudah terinstall!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 PWA Debug & Install</h3>
        
        {/* PWA Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className={`p-2 rounded text-xs text-center ${pwaStatus.isHTTPS ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            HTTPS: {pwaStatus.isHTTPS ? '✅' : '❌'}
          </div>
          <div className={`p-2 rounded text-xs text-center ${pwaStatus.hasManifest ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Manifest: {pwaStatus.hasManifest ? '✅' : '❌'}
          </div>
          <div className={`p-2 rounded text-xs text-center ${pwaStatus.swRegistered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            SW: {pwaStatus.swRegistered ? '✅' : '⏳'}
          </div>
          <div className={`p-2 rounded text-xs text-center ${pwaStatus.hasUserEngagement ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            Engagement: {pwaStatus.hasUserEngagement ? '✅' : '⏳'}
          </div>
        </div>

        {/* Detailed Status */}
        <div className="bg-gray-50 rounded p-3 mb-4">
          <div className="text-xs space-y-1">
            <div><strong>Browser:</strong> {pwaStatus.isChrome ? 'Chrome' : pwaStatus.isEdge ? 'Edge' : pwaStatus.isSafari ? 'Safari' : 'Other'}</div>
            <div><strong>Mobile:</strong> {pwaStatus.isMobile ? 'Yes' : 'No'}</div>
            <div><strong>Display Mode:</strong> {pwaStatus.displayMode}</div>
            <div><strong>Manifest Accessible:</strong> {pwaStatus.manifestAccessible ? 'Yes' : 'No'}</div>
            <div><strong>Icons:</strong> {pwaStatus.hasIcons ? 'Yes' : 'No'} {pwaStatus.icon192 && pwaStatus.icon512 ? '(192+512)' : ''}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleForceSWRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
          >
            🔄 Force SW Register
          </button>
          <button
            onClick={handleRefresh}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
          >
            🔄 Reload
          </button>
        </div>

        {/* Install Button */}
        {showInstallButton && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium">🎉 PWA Siap Diinstall!</p>
                <p className="text-blue-600 text-sm">Klik tombol di bawah untuk install</p>
              </div>
              <button
                onClick={handleNativeInstall}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                📱 Install Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Manual Install Fallback */}
        {!showInstallButton && pwaStatus.isHTTPS && pwaStatus.hasManifest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-medium">📋 Install Manual</p>
                <p className="text-yellow-600 text-sm">Gunakan instruksi manual untuk install</p>
              </div>
              <button
                onClick={handleManualInstall}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                📋 Cara Install
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-700">
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}
      </div>
    </div>
  );
}
