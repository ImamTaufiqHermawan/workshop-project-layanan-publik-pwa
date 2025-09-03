"use client";

import { useState, useEffect } from "react";

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      
      console.log('PWA Install Check:', {
        isStandalone,
        isIOSStandalone,
        userAgent: navigator.userAgent
      });
      
      if (isStandalone || isIOSStandalone) {
        setIsInstalled(true);
        setShowButton(false);
        setDebugInfo('PWA sudah terinstall');
      } else {
        setIsInstalled(false);
        setShowButton(false);
        setDebugInfo('Menunggu install prompt...');
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 beforeinstallprompt event fired!', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
      setDebugInfo('Install prompt tersedia - klik tombol untuk install!');
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('✅ appinstalled event fired');
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
      setDebugInfo('PWA berhasil diinstall');
    };

    // Check if browser supports PWA installation
    const checkPWASupport = () => {
      const isSupported = 'serviceWorker' in navigator;
      console.log('PWA Support Check:', {
        serviceWorker: 'serviceWorker' in navigator,
        isSupported
      });
      
      if (!isSupported) {
        setDebugInfo('Browser tidak mendukung PWA');
        return false;
      }
      return true;
    };

    // Check initial state
    if (checkPWASupport()) {
      checkIfInstalled();
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkIfInstalled);

    // Debug: Check if we're on HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setDebugInfo('PWA membutuhkan HTTPS (kecuali localhost)');
    }

    // Log current state for debugging
    console.log('🔍 PWA Install Button initialized');
    console.log('Current state:', {
      isInstalled,
      showButton,
      deferredPrompt: !!deferredPrompt,
      protocol: location.protocol,
      hostname: location.hostname
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', checkIfInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      console.log('🚀 Showing native install prompt...');
      
      try {
        // This will show the native install prompt like Codashop
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
          setDebugInfo('User menerima install prompt');
        } else {
          setDebugInfo('User menolak install prompt');
        }
      } catch (error) {
        console.error('Install prompt error:', error);
        setDebugInfo('Error saat install prompt');
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowButton(false);
    } else {
      console.log('❌ No deferred prompt available');
      setDebugInfo('Install prompt tidak tersedia');
    }
  };

  // Don't show button if PWA is installed
  if (isInstalled) {
    return (
      <div className="bg-green-100 rounded-lg border border-green-200 p-4 mb-6">
        <div className="text-center text-green-800">
          <p className="text-sm font-medium">✅ PWA Sudah Terinstall</p>
          <p className="text-xs mt-1">Aplikasi dapat diakses dari home screen</p>
        </div>
      </div>
    );
  }

  // Don't show button if not supposed to show
  if (!showButton) {
    return (
      <div className="bg-gray-100 rounded-lg border p-4 mb-6">
        <div className="text-center text-gray-600">
          <p className="text-sm">{debugInfo || 'PWA Install Button'}</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer">Debug Info</summary>
              <div className="mt-2 text-left bg-white p-2 rounded border">
                <p>Deferred Prompt: {deferredPrompt ? 'Available' : 'None'}</p>
                <p>Is Installed: {isInstalled ? 'Yes' : 'No'}</p>
                <p>Show Button: {showButton ? 'Yes' : 'No'}</p>
                <p>Protocol: {location.protocol}</p>
                <p>Hostname: {location.hostname}</p>
                <p>User Agent: {navigator.userAgent.substring(0, 100)}...</p>
              </div>
            </details>
          )}
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
            Tambahkan Layanan Masyarakat ke home screen Anda dengan akses 1-klik
          </p>
          {debugInfo && (
            <p className="text-sm text-gray-500 mt-1">{debugInfo}</p>
          )}
        </div>
        <button
          onClick={handleInstallClick}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <span>Install Sekarang</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
