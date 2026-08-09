import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
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

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { title, file_type, file_url, size_mb, course_id } = await request.json();

    if (!title || !file_url) {
      return Response.json({ error: "title and file_url are required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO materials (course_id, title, file_type, file_url, size_mb)
      VALUES (${course_id || null}, ${title}, ${file_type || "PDF"}, ${file_url}, ${size_mb || null})
      RETURNING id, course_id, title, file_type, file_url, size_mb
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("Failed to save material:", error);
    return Response.json({ error: "Failed to save material" }, { status: 500 });
  }
}
