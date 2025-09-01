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

    const submissions = await Submission.findAll({
      order: [["created_at", "DESC"]], // Use database column name
      attributes: [
        "id",
        "tracking_code",
        "nama",
        "jenis_layanan",
        "status",
        "created_at",
        "updated_at",
      ],
    });

    // Vercel-specific no-cache headers
    const response = NextResponse.json(submissions);

    // Standard cache control
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, private"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    // Vercel-specific headers
    response.headers.set("Surrogate-Control", "no-store");
    response.headers.set("CDN-Cache-Control", "no-cache");
    response.headers.set("Vercel-CDN-Cache-Control", "no-cache");

    // Force fresh response
    response.headers.set("Last-Modified", new Date().toUTCString());
    response.headers.set("ETag", `"${Date.now()}"`);

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
