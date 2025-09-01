// Script untuk test dan debug Vercel cache issues
// Jalankan script ini di console browser

console.log("🔍 Testing Vercel cache issues...");

// Test 1: Check Response Headers
async function checkVercelHeaders() {
  console.log("\n📋 Test 1: Vercel Response Headers");

  try {
    const response = await fetch("/api/admin/submissions");

    console.log("✅ API response status:", response.status);

    // Check all headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    console.log("📋 All headers:", headers);

    // Check specific cache headers
    const cacheControl = response.headers.get("cache-control");
    const pragma = response.headers.get("pragma");
    const expires = response.headers.get("expires");
    const surrogateControl = response.headers.get("surrogate-control");
    const cdnCacheControl = response.headers.get("cdn-cache-control");
    const vercelCdnCacheControl = response.headers.get(
      "vercel-cdn-cache-control"
    );

    console.log("\n🔒 Cache Headers:");
    console.log("  Cache-Control:", cacheControl);
    console.log("  Pragma:", pragma);
    console.log("  Expires:", expires);
    console.log("  Surrogate-Control:", surrogateControl);
    console.log("  CDN-Cache-Control:", cdnCacheControl);
    console.log("  Vercel-CDN-Cache-Control:", vercelCdnCacheControl);

    // Verify Vercel-specific headers
    const hasVercelHeaders = cdnCacheControl && vercelCdnCacheControl;
    if (hasVercelHeaders) {
      console.log("✅ Vercel-specific headers terdeteksi");
    } else {
      console.log("⚠️ Vercel-specific headers tidak ada");
    }

    return headers;
  } catch (error) {
    console.error("❌ Error checking headers:", error);
    return null;
  }
}

// Test 2: Check Cache Behavior
async function checkCacheBehavior() {
  console.log("\n🧪 Test 2: Cache Behavior Test");

  try {
    const iterations = 3;
    const responses = [];

    console.log(`🔄 Testing ${iterations} API calls...`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();
      const end = performance.now();

      const duration = end - start;
      const cacheStatus = response.headers.get("x-cache") || "unknown";
      const age = response.headers.get("age") || "unknown";

      responses.push({
        call: i + 1,
        duration: duration.toFixed(2),
        records: data.length,
        cacheStatus,
        age,
        timestamp: new Date().toISOString(),
      });

      console.log(
        `  Call ${i + 1}: ${duration}ms - ${
          data.length
        } records - Cache: ${cacheStatus} - Age: ${age}`
      );

      // Wait between calls
      if (i < iterations - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("\n📊 Cache Analysis:");
    console.log("  Responses:", responses);

    // Check if responses are cached
    const cachedResponses = responses.filter(
      (r) => r.cacheStatus !== "MISS" && r.age !== "0"
    );
    if (cachedResponses.length > 0) {
      console.log("⚠️ Beberapa responses di-cache oleh Vercel");
    } else {
      console.log("✅ Semua responses fresh (tidak di-cache)");
    }

    return responses;
  } catch (error) {
    console.error("❌ Error testing cache behavior:", error);
    return null;
  }
}

// Test 3: Force Cache Bypass
async function forceCacheBypass() {
  console.log("\n🚫 Test 3: Force Cache Bypass");

  try {
    // Method 1: Timestamp parameter
    const timestamp1 = Date.now();
    const response1 = await fetch(`/api/admin/submissions?t=${timestamp1}`);
    const data1 = await response1.json();

    console.log("📊 Timestamp method - Total:", data1.length);

    // Method 2: Random parameter
    const random = Math.random().toString(36).substring(7);
    const response2 = await fetch(`/api/admin/submissions?r=${random}`);
    const data2 = await response2.json();

    console.log("📊 Random method - Total:", data2.length);

    // Method 3: Cache-busting headers
    const response3 = await fetch("/api/admin/submissions", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const data3 = await response3.json();

    console.log("📊 Headers method - Total:", data3.length);

    // Compare results
    const allSame =
      data1.length === data2.length && data2.length === data3.length;
    if (allSame) {
      console.log("✅ Semua methods return data yang sama");
    } else {
      console.log("⚠️ Ada perbedaan data antar methods");
    }

    return { data1, data2, data3 };
  } catch (error) {
    console.error("❌ Error testing cache bypass:", error);
    return null;
  }
}

// Test 4: Check Vercel Environment
function checkVercelEnvironment() {
  console.log("\n🌐 Test 4: Vercel Environment Check");

  try {
    // Check if we're on Vercel
    const isVercel =
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes("vercel.com");

    console.log("🏠 Hostname:", window.location.hostname);
    console.log("🚀 Is Vercel:", isVercel);

    // Check for Vercel-specific headers in current page
    const metaTags = document.querySelectorAll("meta");
    const vercelMeta = Array.from(metaTags).filter(
      (tag) =>
        tag.getAttribute("name")?.includes("vercel") ||
        tag.getAttribute("property")?.includes("vercel")
    );

    console.log("🏷️ Vercel meta tags:", vercelMeta.length);

    // Check for Vercel in response headers
    fetch("/api/admin/submissions").then((response) => {
      const server = response.headers.get("server");
      const poweredBy = response.headers.get("x-powered-by");

      console.log("🖥️ Server:", server);
      console.log("⚡ Powered by:", poweredBy);

      const isVercelServer =
        server?.includes("vercel") || poweredBy?.includes("vercel");
      console.log("🚀 Vercel server detected:", isVercelServer);
    });

    return { isVercel, hostname: window.location.hostname };
  } catch (error) {
    console.error("❌ Error checking Vercel environment:", error);
    return null;
  }
}

// Main test function
async function runVercelTests() {
  console.log("🚀 Memulai test Vercel cache...\n");

  const results = await Promise.all([
    checkVercelHeaders(),
    checkCacheBehavior(),
    forceCacheBypass(),
    checkVercelEnvironment(),
  ]);

  console.log("\n" + "=".repeat(60));
  console.log("📊 HASIL TEST VERCEL CACHE");
  console.log("=".repeat(60));

  if (results.every((r) => r !== null)) {
    console.log("✅ Semua test berhasil dijalankan");
    console.log("💡 Check hasil di atas untuk analisis cache");
  } else {
    console.log("⚠️ Beberapa test gagal");
  }

  console.log("=".repeat(60));

  return results;
}

// Export functions
window.vercelCacheTests = {
  checkVercelHeaders,
  checkCacheBehavior,
  forceCacheBypass,
  checkVercelEnvironment,
  runVercelTests,
};

console.log(
  "🎯 Vercel cache test utilities tersedia di window.vercelCacheTests"
);
console.log("💡 Jalankan: vercelCacheTests.runVercelTests() untuk semua test");
console.log("💡 Atau jalankan test individual sesuai kebutuhan");

// Auto-run if on admin page
if (window.location.pathname.includes("/admin")) {
  console.log("🏛️ Halaman admin terdeteksi, siap untuk testing Vercel cache");
  console.log(
    "💡 Jalankan vercelCacheTests.runVercelTests() untuk memulai test"
  );
}
