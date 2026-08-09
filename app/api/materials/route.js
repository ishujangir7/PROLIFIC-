import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, course_id, title, file_type, file_url, size_mb
      FROM materials
      ORDER BY id
    `;
    return Response.json(rows);
  } catch (error) {
    console.error("Failed to load materials:", error);
    return Response.json({ error: "Failed to load materials" }, { status: 500 });
  }
}
