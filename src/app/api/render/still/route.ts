import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { compositionId, inputProps, frame = 45, width, height } = body;

    if (!compositionId) {
      return NextResponse.json({ error: "compositionId is required" }, { status: 400 });
    }

    // Dynamic imports for server-only packages
    const { bundle } = await import("@remotion/bundler");
    const { renderStill, selectComposition } = await import("@remotion/renderer");

    // Bundle the Remotion project (cached after first call)
    const entryPoint = path.resolve(process.cwd(), "src/remotion/entry.ts");

    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: inputProps || {},
    });

    // Override dimensions if provided
    if (width) composition.width = width;
    if (height) composition.height = height;

    // Render to temp file
    const outputPath = path.join(os.tmpdir(), `dc-still-${Date.now()}.png`);

    await renderStill({
      serveUrl: bundleLocation,
      composition,
      output: outputPath,
      frame: frame,
      inputProps: inputProps || {},
    });

    // Read and return the image
    const imageBuffer = fs.readFileSync(outputPath);

    // Cleanup
    fs.unlinkSync(outputPath);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="datacore-${compositionId}.png"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Render still error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Render failed" },
      { status: 500 },
    );
  }
}
