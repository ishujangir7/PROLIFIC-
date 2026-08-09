import { handleUpload } from "@vercel/blob/client";

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // NOTE: this is currently open to anyone who can reach the site —
        // there's no admin login yet. Add auth here once Step 5 (admin
        // accounts) exists, before relying on this in a real launch.
        return {
          allowedContentTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 20 * 1024 * 1024, // 20MB cap
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Blob upload completed:", blob.url);
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Upload authorization failed:", error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}
