"use client";

import { useState, useEffect } from "react";

export default function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if PWA is installed
    const checkPWAStatus = () => {
      // Check if running in standalone mode
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
      
      setIsStandalone(standalone);
      setIsInstalled(standalone);
    };

    // Check online status
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Initial checks
    checkPWAStatus();
    checkOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWAStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
      mediaQuery.removeEventListener('change', checkPWAStatus);
    };
  }, []);

  if (!isInstalled) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            Aplikasi PWA Terinstall
          </p>
          <p className="text-xs text-green-600">
            {isOnline ? 'Online' : 'Offline'} • Standalone Mode
          </p>
        </div>
      </div>
    </div>
  );
}
