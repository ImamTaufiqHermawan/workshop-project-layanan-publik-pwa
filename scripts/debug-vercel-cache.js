// Script debug lengkap untuk Vercel cache issues
// Copy-paste di console browser

console.log("🔍 Debug Vercel Cache Issues...");

// Debug 1: Check current API response
async function debugCurrentAPI() {
  console.log("\n📋 Debug 1: Current API Response");

  try {
    const response = await fetch("/api/admin/submissions");
    const data = await response.json();

    console.log("✅ API Status:", response.status);
    console.log("📊 Data Count:", data.length);

    // Check headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    console.log("📋 All Headers:", headers);

    // Check cache status
    const cacheControl = response.headers.get("cache-control");
    const age = response.headers.get("age");
    const xCache = response.headers.get("x-cache");
    const server = response.headers.get("server");

    console.log("\n🔒 Cache Analysis:");
    console.log("  Cache-Control:", cacheControl);
    console.log("  Age:", age);
    console.log("  X-Cache:", xCache);
    console.log("  Server:", server);

    // Determine cache status
    if (age && age > 0) {
      console.log("⚠️ RESPONSE DI-CACHE oleh Vercel (Age:", age, "s)");
    } else if (xCache === "HIT") {
      console.log("⚠️ RESPONSE DI-CACHE oleh CDN");
    } else {
      console.log("✅ Response fresh (tidak di-cache)");
    }

    return { data, headers, cacheStatus: { age, xCache, cacheControl } };
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

// Debug 2: Test cache bypass methods
async function debugCacheBypass() {
  console.log("\n🚫 Debug 2: Cache Bypass Methods");

  const methods = [
    {
      name: "Timestamp",
      url: `/api/admin/submissions?t=${Date.now()}`,
      headers: {},
    },
    {
      name: "Random",
      url: `/api/admin/submissions?r=${Math.random()}`,
      headers: {},
    },
    {
      name: "Cache Headers",
      url: "/api/admin/submissions",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
    },
    {
      name: "Force Fresh",
      url: `/api/admin/submissions?fresh=${Date.now()}&bypass=1`,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    },
  ];

  const results = [];

  for (const method of methods) {
    try {
      console.log(`\n🔄 Testing: ${method.name}`);

      const start = performance.now();
      const response = await fetch(method.url, { headers: method.headers });
      const data = await response.json();
      const end = performance.now();

      const duration = end - start;
      const age = response.headers.get("age");
      const xCache = response.headers.get("x-cache");

      const result = {
        method: method.name,
        duration: duration.toFixed(2),
        count: data.length,
        age,
        xCache,
        cached: age > 0 || xCache === "HIT",
      };

      results.push(result);

      console.log(`  ⏱️ Duration: ${duration.toFixed(2)}ms`);
      console.log(`  📊 Records: ${data.length}`);
      console.log(`  🕐 Age: ${age || "N/A"}`);
      console.log(`  📦 Cache: ${xCache || "N/A"}`);
      console.log(`  🔒 Cached: ${result.cached ? "YES" : "NO"}`);

      if (data.length > 0) {
        console.log(
          `  📝 Latest: ${data[0].tracking_code} (${data[0].created_at})`
        );
      }
    } catch (error) {
      console.error(`  ❌ Error in ${method.name}:`, error);
    }
  }

  console.log("\n📊 Cache Bypass Results:");
  console.table(results);

  return results;
}

// Debug 3: Check Vercel environment
function debugVercelEnvironment() {
  console.log("\n🌐 Debug 3: Vercel Environment");

  const hostname = window.location.hostname;
  const isVercel =
    hostname.includes("vercel.app") || hostname.includes("vercel.com");

  console.log("🏠 Hostname:", hostname);
  console.log("🚀 Is Vercel:", isVercel);
  console.log("🔗 Full URL:", window.location.href);

  // Check for Vercel-specific elements
  const metaTags = document.querySelectorAll("meta");
  const vercelMeta = Array.from(metaTags).filter(
    (tag) =>
      tag.getAttribute("name")?.includes("vercel") ||
      tag.getAttribute("property")?.includes("vercel")
  );

  console.log("🏷️ Vercel meta tags:", vercelMeta.length);

  return { hostname, isVercel, vercelMeta: vercelMeta.length };
}

// Debug 4: Force cache invalidation
async function forceCacheInvalidation() {
  console.log("\n🧹 Debug 4: Force Cache Invalidation");

  try {
    // Clear browser cache
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`🗑️ Browser cache cleared: ${cacheName}`);
      }
    }

    // Clear localStorage (keep admin login)
    const currentPath = window.location.pathname;
    if (currentPath.includes("/admin")) {
      const keysToKeep = ["adminLoggedIn"];
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => !keysToKeep.includes(key)
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log(`🗑️ LocalStorage cleared: ${keysToRemove.length} keys`);
    }

    // Clear sessionStorage
    sessionStorage.clear();
    console.log("🗑️ SessionStorage cleared");

    console.log("✅ Cache invalidation completed");
    return true;
  } catch (error) {
    console.error("❌ Error clearing cache:", error);
    return false;
  }
}

// Debug 5: Test database connection
async function debugDatabase() {
  console.log("\n🗄️ Debug 5: Database Connection");

  try {
    // Test multiple API calls to see if data changes
    const responses = [];

    for (let i = 0; i < 3; i++) {
      const timestamp = Date.now() + i;
      const response = await fetch(`/api/admin/submissions?test=${timestamp}`);
      const data = await response.json();

      responses.push({
        call: i + 1,
        timestamp,
        count: data.length,
        latest: data.length > 0 ? data[0].tracking_code : "N/A",
      });

      // Wait between calls
      if (i < 2) await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("📊 Database Test Results:");
    console.table(responses);

    // Check if data is consistent
    const counts = responses.map((r) => r.count);
    const isConsistent = counts.every((count) => count === counts[0]);

    if (isConsistent) {
      console.log("✅ Database responses consistent");
    } else {
      console.log("⚠️ Database responses inconsistent - possible cache issue");
    }

    return responses;
  } catch (error) {
    console.error("❌ Error testing database:", error);
    return null;
  }
}

// Main debug function
async function runFullDebug() {
  console.log("🚀 Starting Full Vercel Cache Debug...\n");

  const results = await Promise.all([
    debugCurrentAPI(),
    debugCacheBypass(),
    debugVercelEnvironment(),
    forceCacheInvalidation(),
    debugDatabase(),
  ]);

  console.log("\n" + "=".repeat(70));
  console.log("📊 FULL DEBUG RESULTS");
  console.log("=".repeat(70));

  const [apiResult, bypassResult, envResult, cacheResult, dbResult] = results;

  if (apiResult) {
    const { cacheStatus } = apiResult;
    if (cacheStatus.age > 0 || cacheStatus.xCache === "HIT") {
      console.log("🚨 PROBLEM DETECTED: API responses are being cached!");
      console.log(
        "💡 Solution: Use cache bypass methods or wait for Vercel cache invalidation"
      );
    } else {
      console.log("✅ API responses are fresh (not cached)");
    }
  }

  if (bypassResult) {
    const workingMethods = bypassResult.filter((r) => !r.cached);
    console.log(
      `✅ Working cache bypass methods: ${workingMethods.length}/${bypassResult.length}`
    );
  }

  console.log("=".repeat(70));

  return results;
}

// Export functions
window.vercelDebug = {
  debugCurrentAPI,
  debugCacheBypass,
  debugVercelEnvironment,
  forceCacheInvalidation,
  debugDatabase,
  runFullDebug,
};

console.log("🎯 Vercel debug utilities tersedia di window.vercelDebug");
console.log("💡 Jalankan: vercelDebug.runFullDebug() untuk debug lengkap");
console.log("💡 Atau jalankan debug individual sesuai kebutuhan");

// Auto-run if on admin page
if (window.location.pathname.includes("/admin")) {
  console.log("🏛️ Halaman admin terdeteksi, siap untuk debug Vercel cache");
  console.log("💡 Jalankan vercelDebug.runFullDebug() untuk memulai debug");
}
