"use client";

import { useState, useEffect } from "react";

export default function PWABannerTrigger() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState("");

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      return isStandalone || isIOSStandalone;
    };

    if (checkIfInstalled()) {
      return; // Don't show banner if already installed
    }

    // Wait for page to load and then show banner
    const timer = setTimeout(() => {
      console.log('🚀 Attempting to show PWA install banner...');
      
      // Check PWA requirements
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const hasServiceWorker = 'serviceWorker' in navigator;
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      if (hasManifest && hasServiceWorker && isHTTPS) {
        console.log('✅ PWA requirements met, showing banner...');
        setShowBanner(true);
        
        // Determine banner type based on device
        const userAgent = navigator.userAgent;
        if (/Android/i.test(userAgent)) {
          setBannerType("android");
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
          setBannerType("ios");
        } else {
          setBannerType("desktop");
        }
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = () => {
    if (bannerType === "android") {
      // For Android, try to trigger the native banner
      alert(`Untuk menginstall PWA di Android:\n\n` +
        `1. Tap menu ⋮ (3 titik) di Chrome\n` +
        `2. Pilih "Add to Home screen"\n` +
        `3. Tap "Add"\n\n` +
        `Atau gunakan banner "Install app" yang muncul otomatis.`);
    } else if (bannerType === "ios") {
      // For iOS, show manual instructions
      alert(`Untuk menginstall PWA di iOS:\n\n` +
        `1. Tap tombol Share 📤 di Safari\n` +
        `2. Scroll ke bawah dan pilih "Add to Home Screen"\n` +
        `3. Tap "Add"\n\n` +
        `PWA akan muncul di home screen.`);
    } else {
      // For desktop, show general instructions
      alert(`Untuk menginstall PWA:\n\n` +
        `1. Buka menu browser Anda\n` +
        `2. Cari opsi "Add to Home screen"\n` +
        `3. Ikuti instruksi yang muncul`);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg animate-slide-down">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">Install Layanan Publik PWA</p>
            <p className="text-xs text-blue-100">Akses cepat dari home screen</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-blue-100 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
