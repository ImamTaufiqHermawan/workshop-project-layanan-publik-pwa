import { NextResponse } from "next/server";
import { Submission, initializeDatabase } from "@/lib/sequelize";

// Initialize database on first request
let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
};

export async function GET(request) {
  try {
    await initDB();

    // In a real application, you would verify admin authentication here
    // For workshop purposes, we'll skip authentication

    // Force fresh data by adding timestamp to query
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);

    // Parse query parameters untuk force cache bypass
    const { searchParams } = new URL(request.url);
    const queryTimestamp = searchParams.get("t");
    const queryRandom = searchParams.get("r");

    console.log(
      `[${new Date().toISOString()}] Fetching submissions with timestamp: ${timestamp}`
    );
    console.log(
      `[${new Date().toISOString()}] Query params: t=${queryTimestamp}, r=${queryRandom}`
    );

    // Force fresh query dengan random order dan timestamp
    const randomOrder = Math.random() > 0.5 ? "ASC" : "DESC";
    const submissions = await Submission.findAll({
      order: [["created_at", randomOrder]], // Random order untuk force fresh query
      attributes: [
        "id",
        "tracking_code",
        "nama",
        "jenis_layanan",
        "status",
        "created_at",
        "updated_at",
      ],
      // Force fresh data dengan raw query
      raw: false,
    });

    console.log(
      `[${new Date().toISOString()}] Found ${submissions.length} submissions`
    );
    if (submissions.length > 0) {
      console.log(
        `[${new Date().toISOString()}] Latest submission: ${
          submissions[0].tracking_code
        } (${submissions[0].status})`
      );
    }

    // Vercel-specific no-cache headers
    const response = NextResponse.json(submissions);

    // Ultra-aggressive cache control
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, private, max-age=0, s-maxage=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Clear-Site-Data", '"cache"');

    // Vercel-specific headers
    response.headers.set("Surrogate-Control", "no-store");
    response.headers.set("CDN-Cache-Control", "no-cache");
    response.headers.set("Vercel-CDN-Cache-Control", "no-cache");
    response.headers.set("X-Vercel-Cache", "MISS");

    // Force fresh response dengan dynamic values
    response.headers.set("Last-Modified", new Date().toUTCString());
    response.headers.set("ETag", `"${timestamp}-${random}"`);
    response.headers.set("X-Response-Time", `${Date.now()}`);
    response.headers.set("X-Cache-Buster", `${timestamp}-${random}`);

    return response;
  } catch (error) {
    console.error("Error fetching submissions:", error);

    const errorResponse = NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );

    // Same headers for errors
    errorResponse.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, private"
    );
    errorResponse.headers.set("Pragma", "no-cache");
    errorResponse.headers.set("Expires", "0");
    errorResponse.headers.set("Surrogate-Control", "no-store");
    errorResponse.headers.set("CDN-Cache-Control", "no-cache");

    return errorResponse;
  }
}
