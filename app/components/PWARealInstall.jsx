"use client";

import { useState, useEffect } from "react";

export default function PWARealInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installMethod, setInstallMethod] = useState("");
  const [pwaScore, setPwaScore] = useState(0);

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Calculate PWA score based on requirements
    const calculatePWAScore = () => {
      let score = 0;
      const requirements = {
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost',
        hasIcons: !!document.querySelector('link[rel="icon"]'),
        hasThemeColor: !!document.querySelector('meta[name="theme-color"]'),
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasAppleMeta: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
        hasMobileMeta: !!document.querySelector('meta[name="mobile-web-app-capable"]')
      };

      // Calculate score
      Object.values(requirements).forEach(met => {
        if (met) score += 12.5; // 100 / 8 requirements
      });

      setPwaScore(Math.round(score));
      console.log('PWA Score:', score, requirements);
      return requirements;
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 beforeinstallprompt event captured!', e);
      e.preventDefault();
      setCanInstall(true);
      setInstallMethod("native");
      
      // Store the event for later use
      window.deferredPrompt = e;
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setIsInstalled(true);
      setCanInstall(false);
    };

    checkIfInstalled();
    const requirements = calculatePWAScore();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Force check for installability after a delay
    setTimeout(() => {
      if (!canInstall && !isInstalled) {
        console.log('🔍 Force checking PWA installability...');
        
        // Check if we can manually trigger install
        if (requirements.hasManifest && requirements.hasServiceWorker && requirements.isHTTPS) {
          console.log('✅ PWA requirements met, forcing install prompt...');
          setCanInstall(true);
          setInstallMethod("manual");
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [canInstall, isInstalled]);

  const handleNativeInstall = async () => {
    if (window.deferredPrompt) {
      try {
        console.log('🚀 Showing native install prompt...');
        window.deferredPrompt.prompt();
        
        const { outcome } = await window.deferredPrompt.userChoice;
        console.log('Install outcome:', outcome);
        
        if (outcome === 'accepted') {
          setCanInstall(false);
          window.deferredPrompt = null;
        }
      } catch (error) {
        console.error('Native install error:', error);
      }
    }
  };

  const handleManualInstall = () => {
    // Show manual install instructions
    const userAgent = navigator.userAgent;
    let instructions = '';
    
    if (/Android/i.test(userAgent)) {
      instructions = `Untuk menginstall PWA di Android:\n\n` +
        `1. Tap menu ⋮ (3 titik) di Chrome\n` +
        `2. Pilih "Add to Home screen"\n` +
        `3. Tap "Add"\n\n` +
        `Atau gunakan banner "Install app" yang muncul otomatis.`;
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      instructions = `Untuk menginstall PWA di iOS:\n\n` +
        `1. Tap tombol Share 📤 di Safari\n` +
        `2. Scroll ke bawah dan pilih "Add to Home Screen"\n` +
        `3. Tap "Add"\n\n` +
        `PWA akan muncul di home screen.`;
    } else {
      instructions = `Untuk menginstall PWA:\n\n` +
        `1. Buka menu browser Anda\n` +
        `2. Cari opsi "Add to Home screen"\n` +
        `3. Ikuti instruksi yang muncul`;
    }
    
    alert(instructions);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

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

  if (!canInstall) {
    return (
      <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800 text-sm font-medium">Menunggu PWA siap...</span>
          </div>
          
          {/* PWA Score Display */}
          <div className="mb-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-yellow-700 text-xs">PWA Score:</span>
              <div className="w-16 bg-yellow-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${pwaScore >= 80 ? 'bg-green-500' : pwaScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${pwaScore}%` }}
                ></div>
              </div>
              <span className="text-yellow-700 text-xs font-medium">{pwaScore}%</span>
            </div>
            <p className="text-yellow-600 text-xs mt-1">
              {pwaScore >= 80 ? '✅ PWA siap diinstall' : pwaScore >= 60 ? '⚠️ PWA hampir siap' : '❌ PWA belum siap'}
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="text-yellow-700 text-xs underline hover:no-underline"
          >
            Reload halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="text-center">
        <h3 className="text-blue-800 font-medium mb-3">
          🎉 PWA Siap Diinstall!
        </h3>
        
        {/* PWA Score Display */}
        <div className="mb-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-blue-700 text-xs">PWA Score:</span>
            <div className="w-16 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${pwaScore}%` }}
              ></div>
            </div>
            <span className="text-blue-700 text-xs font-medium">{pwaScore}%</span>
          </div>
        </div>
        
        {installMethod === "native" ? (
          <button
            onClick={handleNativeInstall}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-3"
          >
            📱 Install PWA Sekarang
          </button>
        ) : (
          <button
            onClick={handleManualInstall}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-3"
          >
            📋 Cara Install PWA
          </button>
        )}
        
        <p className="text-blue-700 text-xs">
          {installMethod === "native" 
            ? "Klik tombol di atas untuk install PWA (bukan bookmark)" 
            : "Ikuti instruksi untuk install PWA (bukan bookmark)"
          }
        </p>
      </div>
    </div>
  );
}
