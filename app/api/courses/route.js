import { neon } from "@neondatabase/serverless";

export async function GET() {
  const hasUrl = Boolean(process.env.DATABASE_URL);
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, name, description AS desc, teacher, meta, progress, last_watched AS last
      FROM courses
      ORDER BY id
    `;
    return Response.json(rows);
  } catch (error) {
    // TEMPORARY: exposing error.message to diagnose the connection issue.
    // Remove the extra fields once this is working.
    console.error("Failed to load courses:", error);
    return Response.json(
      { error: "Failed to load courses", hasDatabaseUrl: hasUrl, message: error.message },
      { status: 500 }
    );
  }
}