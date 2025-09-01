// Script sederhana untuk clear cache - User friendly untuk workshop
// Copy-paste script ini di console browser (F12 -> Console)

console.log("🔧 Script sederhana untuk clear cache...");

// Function sederhana untuk clear cache
async function clearCache() {
  console.log("🧹 Membersihkan cache...");

  try {
    // 1. Clear browser cache
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`🗑️ Cache ${cacheName} dihapus`);
      }
    }

    // 2. Clear localStorage (jangan hapus adminLoggedIn)
    const currentPath = window.location.pathname;
    if (currentPath.includes("/admin")) {
      // Hanya hapus data non-admin
      const keysToKeep = ["adminLoggedIn"];
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => !keysToKeep.includes(key)
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log(`🗑️ ${keysToRemove.length} data non-admin dihapus`);
    } else {
      localStorage.clear();
      console.log("🗑️ Semua data localStorage dihapus");
    }

    // 3. Clear sessionStorage
    sessionStorage.clear();
    console.log("🗑️ Session storage dihapus");

    console.log("✅ Cache berhasil dibersihkan!");
    console.log("💡 Sekarang refresh halaman untuk data fresh");

    return true;
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

// Function untuk refresh halaman
function refreshPage() {
  console.log("🔄 Memuat ulang halaman...");
  window.location.reload();
}

// Function untuk test API
async function testAPI() {
  try {
    console.log("🧪 Testing API...");
    const response = await fetch("/api/admin/submissions");
    const data = await response.json();

    console.log(`📊 Total pengajuan: ${data.length}`);
    if (data.length > 0) {
      console.log("📝 Pengajuan terbaru:", data[0].tracking_code);
    }

    console.log("✅ API berfungsi dengan baik!");
    return data;
  } catch (error) {
    console.error("❌ Error testing API:", error);
    return null;
  }
}

// Export functions sederhana
window.simpleCache = {
  clear: clearCache,
  refresh: refreshPage,
  test: testAPI,
};

console.log("🎯 Functions tersedia:");
console.log("  simpleCache.clear()  - Bersihkan cache");
console.log("  simpleCache.refresh() - Refresh halaman");
console.log("  simpleCache.test()   - Test API");

// Auto-detect admin page
if (window.location.pathname.includes("/admin")) {
  console.log("🏛️ Halaman admin terdeteksi");
  console.log("💡 Gunakan: simpleCache.clear() lalu simpleCache.refresh()");
}
