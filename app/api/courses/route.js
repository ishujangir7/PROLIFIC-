import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, name, description AS desc, teacher, meta, progress, last_watched AS last
      FROM courses
      ORDER BY id
    `;
    return Response.json(rows);
  } catch (error) {
    console.error("Failed to load courses:", error);
    return Response.json({ error: "Failed to load courses" }, { status: 500 });
  }
}
