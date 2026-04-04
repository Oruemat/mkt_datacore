import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      compositionId,
      inputProps,
      width,
      height,
      fps = 30,
      durationInFrames,
      codec = "h264",
    } = body;

    if (!compositionId) {
      return NextResponse.json({ error: "compositionId is required" }, { status: 400 });
    }

    const { bundle } = await import("@remotion/bundler");
    const { renderMedia, selectComposition } = await import("@remotion/renderer");

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

    if (width) composition.width = width;
    if (height) composition.height = height;
    if (durationInFrames) composition.durationInFrames = durationInFrames;
    if (fps) composition.fps = fps;

    const ext = codec === "h264" ? "mp4" : codec === "vp8" ? "webm" : "mp4";
    const outputPath = path.join(os.tmpdir(), `dc-video-${Date.now()}.${ext}`);

    await renderMedia({
      serveUrl: bundleLocation,
      composition,
      codec,
      outputLocation: outputPath,
      inputProps: inputProps || {},
    });

    const videoBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);

    const contentType = ext === "webm" ? "video/webm" : "video/mp4";

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="datacore-${compositionId}.${ext}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Render video error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Render failed" },
      { status: 500 },
    );
  }
}
