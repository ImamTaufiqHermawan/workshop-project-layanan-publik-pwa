"use client";

import { useState, useEffect } from "react";

export default function MobileInstallGuide() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const ios = /iPad|iPhone|iPod/.test(userAgent);
      const android = /Android/.test(userAgent);

      setIsMobile(mobile);
      setIsIOS(ios);
      setIsAndroid(android);

      // Show guide on mobile after a delay
      if (mobile) {
        setTimeout(() => {
          setShowGuide(true);
        }, 3000); // Show after 3 seconds
      }
    };

    checkDevice();
  }, []);

  if (!isMobile || !showGuide) {
    return null;
  }

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: "🍎 Install di iPhone/iPad",
        steps: [
          "1. Tap tombol Share 📤 di browser Safari",
          "2. Scroll ke bawah dan pilih 'Add to Home Screen'",
          "3. Tap 'Add' untuk menginstall",
          "4. PWA akan muncul di home screen"
        ],
        icon: "🍎"
      };
    } else if (isAndroid) {
      return {
        title: "🤖 Install di Android",
        steps: [
          "1. Tap menu ⋮ (3 titik) di Chrome",
          "2. Pilih 'Add to Home screen' atau 'Install app'",
          "3. Tap 'Install' untuk menginstall",
          "4. PWA akan muncul di home screen"
        ],
        icon: "🤖"
      };
    } else {
      return {
        title: "📱 Install di Mobile",
        steps: [
          "1. Buka menu browser Anda",
          "2. Cari opsi 'Add to Home screen'",
          "3. Ikuti instruksi yang muncul",
          "4. PWA akan tersedia di home screen"
        ],
        icon: "📱"
      };
    }
  };

  const instructions = getInstallInstructions();

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50 animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
            {instructions.icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            {instructions.title}
          </h3>
          
          <div className="space-y-1 mb-3">
            {instructions.steps.map((step, index) => (
              <p key={index} className="text-xs text-gray-600">
                {step}
              </p>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowGuide(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Tutup
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Reload Halaman
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowGuide(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
