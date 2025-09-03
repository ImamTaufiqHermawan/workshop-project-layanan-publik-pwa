"use client";

import { useState, useEffect } from "react";

export default function PWAStatus() {
  const [pwaStatus, setPwaStatus] = useState({
    isInstalled: false,
    isStandalone: false,
    hasServiceWorker: false,
    isHTTPS: false,
    userAgent: "",
    displayMode: "",
    canInstall: false,
    deferredPrompt: null
  });

  useEffect(() => {
    const checkPWAStatus = () => {
      const status = {
        isInstalled: false,
        isStandalone: false,
        hasServiceWorker: false,
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost',
        userAgent: navigator.userAgent,
        displayMode: 'browser',
        canInstall: false,
        deferredPrompt: null
      };

      // Check if PWA is installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        status.isStandalone = true;
        status.displayMode = 'standalone';
        status.isInstalled = true;
      }

      // Check iOS standalone
      if (window.navigator.standalone === true) {
        status.isStandalone = true;
        status.displayMode = 'ios-standalone';
        status.isInstalled = true;
      }

      // Check service worker support
      status.hasServiceWorker = 'serviceWorker' in navigator;

      setPwaStatus(status);
    };

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setPwaStatus(prev => ({
        ...prev,
        canInstall: true,
        deferredPrompt: e
      }));
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setPwaStatus(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false
      }));
    };

    checkPWAStatus();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const getStatusColor = (condition) => {
    return condition ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (condition) => {
    return condition ? '✅' : '❌';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">PWA Status Checker</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">PWA Terinstall:</span>
          <span className={`font-medium ${getStatusColor(pwaStatus.isInstalled)}`}>
            {getStatusIcon(pwaStatus.isInstalled)} {pwaStatus.isInstalled ? 'Ya' : 'Tidak'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Mode Standalone:</span>
          <span className={`font-medium ${getStatusColor(pwaStatus.isStandalone)}`}>
            {getStatusIcon(pwaStatus.isStandalone)} {pwaStatus.displayMode}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Service Worker:</span>
          <span className={`font-medium ${getStatusColor(pwaStatus.hasServiceWorker)}`}>
            {getStatusIcon(pwaStatus.hasServiceWorker)} {pwaStatus.hasServiceWorker ? 'Tersedia' : 'Tidak Tersedia'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">HTTPS:</span>
          <span className={`font-medium ${getStatusColor(pwaStatus.isHTTPS)}`}>
            {getStatusIcon(pwaStatus.isHTTPS)} {pwaStatus.isHTTPS ? 'Ya' : 'Tidak'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Bisa Install:</span>
          <span className={`font-medium ${getStatusColor(pwaStatus.canInstall)}`}>
            {getStatusIcon(pwaStatus.canInstall)} {pwaStatus.canInstall ? 'Ya' : 'Tidak'}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">User Agent:</h4>
        <p className="text-xs text-gray-600 break-all">{pwaStatus.userAgent}</p>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-700 mb-2">Tips PWA:</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Pastikan menggunakan HTTPS (kecuali localhost)</li>
          <li>• Gunakan browser yang mendukung PWA (Chrome, Edge, Safari)</li>
          <li>• Pastikan manifest.json dan service-worker.js dapat diakses</li>
          <li>• Reload halaman jika tombol install tidak muncul</li>
        </ul>
      </div>
    </div>
  );
}
