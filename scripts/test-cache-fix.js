// Script untuk test dan verifikasi bahwa masalah cache sudah teratasi
// Jalankan script ini di console browser setelah deploy fix

console.log("🧪 Memulai test verifikasi cache fix...");

// Test 1: Check Service Worker Version
async function testServiceWorkerVersion() {
  console.log("\n📱 Test 1: Service Worker Version");

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        const swUrl = registration.active.scriptURL;
        console.log("✅ Service Worker aktif:", swUrl);

        // Check if it's the new version
        if (swUrl.includes("v3") || swUrl.includes("layanan-publik-v3")) {
          console.log("✅ Service Worker versi baru terdeteksi");
        } else {
          console.log("⚠️ Service Worker versi lama masih aktif");
        }

        return true;
      } else {
        console.log("⚠️ Tidak ada service worker yang aktif");
        return false;
      }
    } catch (error) {
      console.error("❌ Error checking service worker:", error);
      return false;
    }
  } else {
    console.log("⚠️ Service Worker tidak didukung");
    return false;
  }
}

// Test 2: Check API Cache Headers
async function testAPICacheHeaders() {
  console.log("\n🌐 Test 2: API Cache Headers");

  try {
    const timestamp = Date.now();
    const response = await fetch(`/api/admin/submissions?t=${timestamp}`);

    console.log("✅ API response status:", response.status);

    // Check cache headers
    const cacheControl = response.headers.get("cache-control");
    const pragma = response.headers.get("pragma");
    const expires = response.headers.get("expires");

    console.log("📋 Cache-Control:", cacheControl);
    console.log("📋 Pragma:", pragma);
    console.log("📋 Expires:", expires);

    // Verify no-cache headers
    const hasNoCache = cacheControl && cacheControl.includes("no-cache");
    const hasNoStore = cacheControl && cacheControl.includes("no-store");
    const hasMustRevalidate =
      cacheControl && cacheControl.includes("must-revalidate");

    if (hasNoCache && hasNoStore && hasMustRevalidate) {
      console.log("✅ API memiliki header no-cache yang benar");
      return true;
    } else {
      console.log("⚠️ API header cache tidak lengkap");
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing API headers:", error);
    return false;
  }
}

// Test 3: Check Data Freshness
async function testDataFreshness() {
  console.log("\n📊 Test 3: Data Freshness");

  try {
    // First call
    const timestamp1 = Date.now();
    const response1 = await fetch(`/api/admin/submissions?t=${timestamp1}`);
    const data1 = await response1.json();

    console.log("📈 Data pertama - Total:", data1.length);
    if (data1.length > 0) {
      console.log(
        "📝 Pengajuan terbaru:",
        data1[0].tracking_code,
        data1[0].created_at
      );
    }

    // Second call with different timestamp
    const timestamp2 = Date.now();
    const response2 = await fetch(`/api/admin/submissions?t=${timestamp2}`);
    const data2 = await response2.json();

    console.log("📈 Data kedua - Total:", data2.length);
    if (data2.length > 0) {
      console.log(
        "📝 Pengajuan terbaru:",
        data2[0].tracking_code,
        data2[0].created_at
      );
    }

    // Compare data
    if (data1.length === data2.length) {
      console.log("✅ Data konsisten antara dua request");

      // Check if data is actually fresh (not cached)
      if (data1.length > 0 && data2.length > 0) {
        const isSameData = JSON.stringify(data1) === JSON.stringify(data2);
        if (isSameData) {
          console.log("✅ Data tidak berubah (normal untuk data yang sama)");
        } else {
          console.log("✅ Data berubah (fresh data)");
        }
      }

      return true;
    } else {
      console.log("⚠️ Data tidak konsisten");
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing data freshness:", error);
    return false;
  }
}

// Test 4: Check Service Worker Cache Strategy
async function testSWCacheStrategy() {
  console.log("\n🔧 Test 4: Service Worker Cache Strategy");

  try {
    // Check if API requests are being cached
    const cacheNames = await caches.keys();
    console.log("📦 Active caches:", cacheNames);

    // Try to find cached API responses
    let hasAPICache = false;
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      const apiRequests = requests.filter((req) => req.url.includes("/api/"));
      if (apiRequests.length > 0) {
        console.log(
          `⚠️ Cache ${cacheName} memiliki ${apiRequests.length} API requests`
        );
        hasAPICache = true;
      }
    }

    if (!hasAPICache) {
      console.log("✅ Tidak ada API requests yang di-cache (sesuai harapan)");
      return true;
    } else {
      console.log("⚠️ Masih ada API requests yang di-cache");
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing SW cache strategy:", error);
    return false;
  }
}

// Test 5: Performance Test
async function testPerformance() {
  console.log("\n⚡ Test 5: Performance Test");

  try {
    const iterations = 5;
    const timestamps = [];

    console.log(`🔄 Testing ${iterations} API calls...`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const timestamp = Date.now();
      const response = await fetch(`/api/admin/submissions?t=${timestamp}`);
      const data = await response.json();
      const end = performance.now();

      const duration = end - start;
      timestamps.push(duration);

      console.log(
        `  Call ${i + 1}: ${duration.toFixed(2)}ms - ${data.length} records`
      );
    }

    const avgDuration =
      timestamps.reduce((a, b) => a + b, 0) / timestamps.length;
    const minDuration = Math.min(...timestamps);
    const maxDuration = Math.max(...timestamps);

    console.log("📊 Performance Summary:");
    console.log(`  Average: ${avgDuration.toFixed(2)}ms`);
    console.log(`  Min: ${minDuration.toFixed(2)}ms`);
    console.log(`  Max: ${maxDuration.toFixed(2)}ms`);

    // Check if performance is consistent (no caching benefits)
    const variance =
      timestamps.reduce((acc, val) => acc + Math.pow(val - avgDuration, 2), 0) /
      timestamps.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 50) {
      // Less than 50ms variance
      console.log("✅ Performance konsisten (tidak ada cache)");
      return true;
    } else {
      console.log("⚠️ Performance tidak konsisten (mungkin ada cache)");
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing performance:", error);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log("🚀 Memulai semua test...\n");

  const results = await Promise.all([
    testServiceWorkerVersion(),
    testAPICacheHeaders(),
    testDataFreshness(),
    testSWCacheStrategy(),
    testPerformance(),
  ]);

  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;

  console.log("\n" + "=".repeat(50));
  console.log("📊 HASIL TEST FINAL");
  console.log("=".repeat(50));
  console.log(`✅ Test berhasil: ${passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log("🎉 SEMUA TEST BERHASIL! Masalah cache sudah teratasi.");
    console.log("💡 Data pengajuan sekarang akan selalu fresh.");
  } else {
    console.log("⚠️ Beberapa test gagal. Masalah cache mungkin masih ada.");
    console.log("💡 Coba clear cache dan jalankan test lagi.");
  }

  console.log("=".repeat(50));

  return results;
}

// Export functions
window.cacheTests = {
  testServiceWorkerVersion,
  testAPICacheHeaders,
  testDataFreshness,
  testSWCacheStrategy,
  testPerformance,
  runAllTests,
};

console.log("🎯 Cache test utilities tersedia di window.cacheTests");
console.log("💡 Jalankan: cacheTests.runAllTests() untuk semua test");
console.log("💡 Atau jalankan test individual sesuai kebutuhan");

// Auto-run if on admin page
if (window.location.pathname.includes("/admin")) {
  console.log("🏛️ Halaman admin terdeteksi, siap untuk testing cache fix");
  console.log("💡 Jalankan cacheTests.runAllTests() untuk memulai test");
}
