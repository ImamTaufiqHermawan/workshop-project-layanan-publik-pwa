"use client";

import { useState, useEffect } from "react";

export default function PWADebugger() {
  const [debugInfo, setDebugInfo] = useState({
    userAgent: "",
    isHTTPS: false,
    hasServiceWorker: false,
    hasManifest: false,
    displayMode: "",
    beforeinstallpromptFired: false,
    appinstalledFired: false,
    consoleLogs: []
  });

  useEffect(() => {
    const logs = [];
    
    const log = (message) => {
      logs.push(`${new Date().toLocaleTimeString()}: ${message}`);
      setDebugInfo(prev => ({ ...prev, consoleLogs: [...logs] }));
      console.log(message);
    };

    // Check basic PWA requirements
    const checkPWARequirements = () => {
      log('🔍 Checking PWA requirements...');
      
      const userAgent = navigator.userAgent;
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';
      
      setDebugInfo(prev => ({
        ...prev,
        userAgent,
        isHTTPS,
        hasServiceWorker,
        hasManifest,
        displayMode
      }));

      log(`✅ HTTPS: ${isHTTPS}`);
      log(`✅ Service Worker: ${hasServiceWorker}`);
      log(`✅ Manifest: ${hasManifest}`);
      log(`✅ Display Mode: ${displayMode}`);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      log('🎉 beforeinstallprompt event FIRED!');
      log(`Event details: ${JSON.stringify({
        prompt: !!e.prompt,
        userChoice: !!e.userChoice,
        platforms: e.platforms
      })}`);
      
      setDebugInfo(prev => ({ ...prev, beforeinstallpromptFired: true }));
      
      // Prevent the default behavior
      e.preventDefault();
      
      // Store the event for later use
      window.deferredPrompt = e;
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      log('✅ appinstalled event FIRED!');
      setDebugInfo(prev => ({ ...prev, appinstalledFired: true }));
    };

    // Check if PWA is already installed
    const checkInstallationStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      
      if (isStandalone || isIOSStandalone) {
        log('📱 PWA already installed (standalone mode)');
      } else {
        log('🌐 PWA not installed (browser mode)');
      }
    };

    // Check for common issues
    const checkCommonIssues = () => {
      log('🔍 Checking for common PWA issues...');
      
      // Check if we're in an iframe
      if (window.self !== window.top) {
        log('❌ PWA cannot install from iframe');
      }
      
      // Check if we're in incognito mode (this is hard to detect)
      if (navigator.webdriver) {
        log('⚠️ Possible incognito/private mode detected');
      }
      
      // Check if we have sufficient engagement
      log('ℹ️ PWA install requires user engagement (clicks, scrolls, etc.)');
    };

    // Initialize debugging
    log('🚀 PWA Debugger initialized');
    checkPWARequirements();
    checkInstallationStatus();
    checkCommonIssues();

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', (e) => {
      log(`🔄 Display mode changed: ${e.matches ? 'standalone' : 'browser'}`);
    });

    // Log user interactions to help trigger beforeinstallprompt
    const logUserInteraction = () => {
      log('👆 User interaction detected - this may help trigger beforeinstallprompt');
    };

    document.addEventListener('click', logUserInteraction);
    document.addEventListener('scroll', logUserInteraction);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', logUserInteraction);
      document.removeEventListener('click', logUserInteraction);
      document.removeEventListener('scroll', logUserInteraction);
    };
  }, []);

  const clearLogs = () => {
    setDebugInfo(prev => ({ ...prev, consoleLogs: [] }));
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 mb-6 font-mono text-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">🔧 PWA Debugger</h3>
        <button
          onClick={clearLogs}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs"
        >
          Clear Logs
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <p><span className="text-green-400">HTTPS:</span> {debugInfo.isHTTPS ? '✅' : '❌'}</p>
          <p><span className="text-green-400">SW:</span> {debugInfo.hasServiceWorker ? '✅' : '❌'}</p>
          <p><span className="text-green-400">Manifest:</span> {debugInfo.hasManifest ? '✅' : '❌'}</p>
        </div>
        <div>
          <p><span className="text-green-400">Display:</span> {debugInfo.displayMode}</p>
          <p><span className="text-green-400">beforeinstallprompt:</span> {debugInfo.beforeinstallpromptFired ? '🎉' : '⏳'}</p>
          <p><span className="text-green-400">appinstalled:</span> {debugInfo.appinstalledFired ? '✅' : '⏳'}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-300 text-xs mb-2">User Agent:</p>
        <p className="text-gray-400 text-xs break-all">{debugInfo.userAgent}</p>
      </div>
      
      <div>
        <p className="text-gray-300 text-xs mb-2">Console Logs:</p>
        <div className="bg-black rounded p-2 max-h-40 overflow-y-auto">
          {debugInfo.consoleLogs.map((log, index) => (
            <div key={index} className="text-green-400 text-xs mb-1">
              {log}
            </div>
          ))}
          {debugInfo.consoleLogs.length === 0 && (
            <div className="text-gray-500 text-xs">No logs yet...</div>
          )}
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-blue-900 rounded text-xs">
        <p className="text-blue-200 font-semibold">💡 Tips:</p>
        <ul className="text-blue-100 mt-1 space-y-1">
          <li>• Scroll dan click di halaman untuk trigger engagement</li>
          <li>• Pastikan tidak dalam incognito mode</li>
          <li>• Reload halaman jika event tidak muncul</li>
          <li>• Check console untuk error messages</li>
        </ul>
      </div>
    </div>
  );
}
