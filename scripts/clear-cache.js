// Script untuk membersihkan cache yang menyebabkan masalah data pengajuan
// Jalankan script ini di console browser (F12 -> Console)

console.log("🚀 Memulai pembersihan cache...");

// 1. Clear Service Worker Cache
async function clearServiceWorkerCache() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        // Send message to clear cache
        registration.active.postMessage({ type: "CLEAR_CACHE" });

        // Force update service worker
        await registration.update();

        console.log("✅ Service Worker cache berhasil dibersihkan");
        return true;
      } else {
        console.log("⚠️ Tidak ada service worker yang aktif");
        return false;
      }
    } catch (error) {
      console.error("❌ Error clearing service worker cache:", error);
      return false;
    }
  } else {
    console.log("⚠️ Service Worker tidak didukung");
    return false;
  }
}

// 2. Clear Browser Cache
async function clearBrowserCache() {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`🗑️ Menghapus cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      console.log("✅ Browser cache berhasil dibersihkan");
      return true;
    } catch (error) {
      console.error("❌ Error clearing browser cache:", error);
      return false;
    }
  } else {
    console.log("⚠️ Cache API tidak didukung");
    return false;
  }
}

// 3. Clear localStorage dan sessionStorage
function clearStorage() {
  try {
    // Jangan hapus adminLoggedIn jika sedang di halaman admin
    const currentPath = window.location.pathname;
    if (!currentPath.includes("/admin")) {
      localStorage.clear();
      sessionStorage.clear();
      console.log("✅ Storage berhasil dibersihkan");
    } else {
      // Hanya hapus data yang tidak penting untuk admin
      const keysToKeep = ["adminLoggedIn"];
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => !keysToKeep.includes(key)
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log("✅ Storage non-admin berhasil dibersihkan");
    }
    return true;
  } catch (error) {
    console.error("❌ Error clearing storage:", error);
    return false;
  }
}

// 4. Force reload dengan cache busting
function forceReload() {
  console.log("🔄 Memuat ulang halaman...");
  // Add timestamp to force fresh load
  const timestamp = Date.now();
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("t", timestamp);

  // Clear all caches first
  Promise.all([
    clearServiceWorkerCache(),
    clearBrowserCache(),
    clearStorage(),
  ]).then(() => {
    setTimeout(() => {
      window.location.href = currentUrl.toString();
    }, 1000);
  });
}

// 5. Test API dengan cache busting
async function testAPI() {
  try {
    const timestamp = Date.now();
    const response = await fetch(`/api/admin/submissions?t=${timestamp}`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    const data = await response.json();
    console.log("📊 Data API:", data);
    console.log(`📈 Total pengajuan: ${data.length}`);

    if (data.length > 0) {
      console.log("✅ API berfungsi dengan baik");
      console.log("📝 Pengajuan terbaru:", data[0]);
    } else {
      console.log("⚠️ API tidak mengembalikan data");
    }

    return data;
  } catch (error) {
    console.error("❌ Error testing API:", error);
    return null;
  }
}

// 6. Main function untuk menjalankan semua
async function clearAllCache() {
  console.log("🧹 Memulai pembersihan cache komprehensif...");

  const results = await Promise.all([
    clearServiceWorkerCache(),
    clearBrowserCache(),
    clearStorage(),
  ]);

  const successCount = results.filter(Boolean).length;
  console.log(`\n📊 Hasil pembersihan: ${successCount}/3 berhasil`);

  if (successCount === 3) {
    console.log("🎉 Semua cache berhasil dibersihkan!");
    console.log("💡 Sekarang coba refresh halaman atau test API");
  } else {
    console.log("⚠️ Beberapa cache gagal dibersihkan");
  }

  return results;
}

// 7. Auto-clear dan test
async function autoClearAndTest() {
  console.log("🤖 Mode otomatis: membersihkan cache dan test API...");

  await clearAllCache();

  console.log("\n🧪 Testing API setelah pembersihan...");
  setTimeout(async () => {
    await testAPI();
  }, 2000);
}

// Export functions untuk digunakan di console
window.cacheUtils = {
  clearServiceWorkerCache,
  clearBrowserCache,
  clearStorage,
  clearAllCache,
  testAPI,
  forceReload,
  autoClearAndTest,
};

console.log("🎯 Cache utilities tersedia di window.cacheUtils");
console.log(
  "💡 Gunakan: cacheUtils.autoClearAndTest() untuk pembersihan otomatis"
);
console.log("💡 Atau: cacheUtils.clearAllCache() untuk pembersihan manual");
console.log("💡 Atau: cacheUtils.testAPI() untuk test API saja");

// Auto-run jika di halaman admin
if (window.location.pathname.includes("/admin")) {
  console.log("🏛️ Halaman admin terdeteksi, siap untuk pembersihan cache");
}
