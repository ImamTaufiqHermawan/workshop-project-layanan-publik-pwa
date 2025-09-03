"use client";

import { useState, useEffect } from "react";

export default function PWASmartInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [installMethod, setInstallMethod] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Listen for beforeinstallprompt event (REAL event only)
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 beforeinstallprompt event captured:', e);
      
      // Validate this is a real event with proper methods
      if (e && typeof e.prompt === 'function' && typeof e.userChoice === 'object') {
        console.log('✅ Valid beforeinstallprompt event detected');
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallButton(true);
        setInstallMethod("native");
        setDebugInfo('Install prompt asli tersedia!');
      } else {
        console.log('❌ Invalid beforeinstallprompt event - missing required methods');
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

    // Only listen for REAL events
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if we can show manual install after a delay
    const timer = setTimeout(() => {
      if (!showInstallButton && !isInstalled) {
        // Check PWA requirements
        const hasManifest = !!document.querySelector('link[rel="manifest"]');
        const hasServiceWorker = 'serviceWorker' in navigator;
        const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
        
        if (hasManifest && hasServiceWorker && isHTTPS) {
          console.log('✅ PWA requirements met, showing manual install option');
          setShowInstallButton(true);
          setInstallMethod("manual");
          setDebugInfo('PWA siap - gunakan instruksi manual');
        }
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showInstallButton, isInstalled]);

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

  // Don't show anything if PWA is installed
  if (isInstalled) {
    return null;
  }

  // Don't show button if not supposed to show
  if (!showInstallButton) {
    return (
      <div className="bg-gray-100 rounded-lg border p-4 mb-6">
        <div className="text-center text-gray-600">
          <p className="text-sm">Menunggu PWA siap...</p>
          {debugInfo && (
            <p className="text-xs mt-1 text-gray-500">{debugInfo}</p>
          )}
          <button
            onClick={handleRefresh}
            className="text-gray-500 text-xs underline hover:no-underline mt-2"
          >
            Reload halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium">
            Install Layanan Publik PWA
          </p>
          <p className="text-sm text-gray-500">
            Akses cepat dari home screen
          </p>
          {debugInfo && (
            <p className="text-xs text-purple-600 mt-1">{debugInfo}</p>
          )}
        </div>
        {installMethod === "native" ? (
          <button
            onClick={handleNativeInstall}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <span>Install Sekarang</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleManualInstall}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <span>Cara Install</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
