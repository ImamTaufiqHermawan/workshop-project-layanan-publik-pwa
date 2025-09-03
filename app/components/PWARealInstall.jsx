"use client";

import { useState, useEffect } from "react";

export default function PWARealInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [pwaScore, setPwaScore] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Calculate PWA Score (0-100)
    const calculatePWAScore = async () => {
      let score = 0;
      const issues = [];

      // HTTPS (25 points)
      if (location.protocol === 'https:' || location.hostname === 'localhost') {
        score += 25;
      } else {
        issues.push('HTTPS required');
      }

      // Manifest (25 points)
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        try {
          const response = await fetch(manifestLink.href);
          if (response.ok) {
            const manifest = await response.json();
            
            // Check icons
            if (manifest.icons && manifest.icons.length >= 2) {
              const has192 = manifest.icons.some(icon => icon.sizes === '192x192');
              const has512 = manifest.icons.some(icon => icon.sizes === '512x512');
              if (has192 && has512) {
                score += 25;
              } else {
                issues.push('Icons 192x192 and 512x512 required');
              }
            } else {
              issues.push('At least 2 icons required');
            }
          } else {
            issues.push('Manifest not accessible');
          }
        } catch {
          issues.push('Manifest fetch failed');
        }
      } else {
        issues.push('Manifest link missing');
      }

      // Service Worker (25 points)
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.active) {
            score += 25;
          } else {
            issues.push('Service Worker not active');
          }
        } catch {
          issues.push('Service Worker registration failed');
        }
      } else {
        issues.push('Service Worker not supported');
      }

      // Display Mode (25 points)
      if (manifestLink) {
        try {
          const response = await fetch(manifestLink.href);
          if (response.ok) {
            const manifest = await response.json();
            if (manifest.display === 'standalone' || manifest.display === 'fullscreen') {
              score += 25;
            } else {
              issues.push('Display mode should be standalone/fullscreen');
            }
          }
        } catch {
          issues.push('Cannot check display mode');
        }
      }

      setPwaScore(score);
      if (issues.length > 0) {
        setDebugInfo(`PWA Score: ${score}/100. Issues: ${issues.join(', ')}`);
      } else {
        setDebugInfo(`PWA Score: ${score}/100 - Perfect!`);
      }
    };

    // Listen for beforeinstallprompt event (REAL PWA install)
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 REAL PWA beforeinstallprompt event captured:', e);
      
      // This is the REAL PWA install prompt, not "add to home screen"
      if (e && typeof e.prompt === 'function' && typeof e.userChoice === 'object') {
        console.log('✅ Valid PWA install prompt detected');
        e.preventDefault();
        setDeferredPrompt(e);
        setDebugInfo('🎉 PWA Install Prompt TERSEDIA! Ini BUKAN "Add to Home Screen"');
      } else {
        console.log('❌ Invalid beforeinstallprompt event');
        setDebugInfo('Event tidak valid - bukan PWA install prompt asli');
      }
    };

    // Listen for appinstalled event (REAL PWA installed)
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully as REAL APP');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setDebugInfo('🎉 PWA berhasil diinstall sebagai APLIKASI ASLI!');
    };

    checkIfInstalled();
    calculatePWAScore();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handlePWAInstall = async () => {
    if (deferredPrompt && typeof deferredPrompt.prompt === 'function') {
      try {
        console.log('🚀 Showing REAL PWA install prompt...');
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        console.log('PWA Install outcome:', outcome);
        
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setDebugInfo('🎉 User menerima PWA install prompt!');
        } else {
          setDebugInfo('User menolak PWA install prompt');
        }
      } catch (error) {
        console.error('PWA Install error:', error);
        setDebugInfo('Error saat PWA install prompt');
      }
    } else {
      console.log('❌ No valid PWA install prompt available');
      setDebugInfo('PWA install prompt tidak tersedia');
    }
  };

  const handleForceSWUpdate = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          setDebugInfo('Service Worker update dipaksa');
        } else {
          setDebugInfo('Service Worker sudah up-to-date');
        }
      } catch (error) {
        setDebugInfo('Gagal update Service Worker');
      }
    }
  };

  // Don't show anything if PWA is already installed
  if (isInstalled) {
    return (
      <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-800 text-sm font-medium">🎉 PWA sudah terinstall sebagai APLIKASI ASLI!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 PWA Real Install (BUKAN Add to Home Screen)</h3>
        
        {/* PWA Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">PWA Score:</span>
            <span className={`text-lg font-bold ${pwaScore >= 80 ? 'text-green-600' : pwaScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {pwaScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${pwaScore >= 80 ? 'bg-green-600' : pwaScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
              style={{ width: `${pwaScore}%` }}
            ></div>
          </div>
        </div>

        {/* PWA Install Button - ONLY shows when REAL prompt is available */}
        {deferredPrompt && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h4 className="text-blue-800 font-bold text-lg mb-2">PWA Install Prompt TERSEDIA!</h4>
              <p className="text-blue-600 text-sm mb-4">
                Ini adalah <strong>PWA install prompt asli</strong>, BUKAN "Add to Home Screen" shortcut!
              </p>
              <button
                onClick={handlePWAInstall}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
              >
                📱 Install PWA Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Manual Instructions - ONLY for PWA, not shortcuts */}
        {!deferredPrompt && pwaScore >= 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <div className="text-center">
              <h4 className="text-yellow-800 font-bold mb-2">📋 Cara Install PWA (BUKAN Shortcut)</h4>
              <p className="text-yellow-600 text-sm mb-3">
                PWA score sudah {pwaScore}/100, tapi install prompt belum muncul.
              </p>
              <div className="text-xs text-yellow-700 space-y-1">
                <p><strong>Android Chrome:</strong> Menu ⋮ → "Install app" (bukan "Add to Home screen")</p>
                <p><strong>iOS Safari:</strong> Share → "Add to Home Screen" (ini PWA, bukan shortcut)</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleForceSWUpdate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
          >
            🔄 Force SW Update
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
          >
            🔄 Reload
          </button>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-700">
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}

        {/* Important Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-xs text-blue-800">
            <strong>⚠️ PENTING:</strong> PWA adalah aplikasi yang bisa diinstall, BUKAN shortcut "Add to Home Screen". 
            Shortcut hanya bookmark website, sedangkan PWA adalah aplikasi offline dengan push notification.
          </div>
        </div>
      </div>
    </div>
  );
}
