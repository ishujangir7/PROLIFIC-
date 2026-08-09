import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, course_id, title, duration, video_url, order_index
      FROM lectures
      ORDER BY order_index
    `;
    return Response.json(rows);
  } catch (error) {
    console.error("Failed to load lectures:", error);
    return Response.json({ error: "Failed to load lectures" }, { status: 500 });
  }
}

