import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, course_id, title, difficulty, question_count, duration_minutes, marks
      FROM tests
      ORDER BY id
    `;
    return Response.json(rows);
  } catch (error) {
    console.error("Failed to load tests:", error);
    return Response.json({ error: "Failed to load tests" }, { status: 500 });
  }
}
