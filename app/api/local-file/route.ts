import { readFile, stat } from "node:fs/promises";
import { basename, extname, isAbsolute } from "node:path";

export const runtime = "nodejs";

function getValidatedPdfPath(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return {
      error: Response.json(
        { error: "Missing query param: path" },
        { status: 400 },
      ),
    };
  }

  if (!isAbsolute(filePath)) {
    return {
      error: Response.json({ error: "Path must be absolute" }, { status: 400 }),
    };
  }

  if (extname(filePath).toLowerCase() !== ".pdf") {
    return {
      error: Response.json(
        { error: "Only .pdf files are supported" },
        { status: 415 },
      ),
    };
  }

  return { filePath };
}

function pdfHeaders(filename: string) {
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${filename}"`,
    "Cache-Control": "no-store",
  };
}

export async function GET(req: Request) {
  try {
    const validated = getValidatedPdfPath(req);
    if ("error" in validated) return validated.error;
    const { filePath } = validated;

    const file = await readFile(filePath);
    const filename = basename(filePath);

    return new Response(file, {
      status: 200,
      headers: pdfHeaders(filename),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read file";
    const isMissing = message.includes("ENOENT");

    return Response.json(
      {
        error: isMissing ? "File not found" : message,
      },
      { status: isMissing ? 404 : 500 },
    );
  }
}

export async function HEAD(req: Request) {
  try {
    const validated = getValidatedPdfPath(req);
    if ("error" in validated) return validated.error;
    const { filePath } = validated;

    const fileInfo = await stat(filePath);
    const filename = basename(filePath);

    return new Response(null, {
      status: 200,
      headers: {
        ...pdfHeaders(filename),
        "Content-Length": String(fileInfo.size),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read file";
    const isMissing = message.includes("ENOENT");

    return Response.json(
      {
        error: isMissing ? "File not found" : message,
      },
      { status: isMissing ? 404 : 500 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, HEAD, OPTIONS",
    },
  });
}
