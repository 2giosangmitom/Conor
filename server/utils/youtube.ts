import { spawn } from "node:child_process";

export async function getYouTubeVideoInfo(youtubeId: string) {
  const process = spawn("yt-dlp", [
    "--dump-single-json",
    "--no-playlist",
    `https://www.youtube.com/watch?v=${youtubeId}`,
  ]);

  let output = "";

  for await (const chunk of process.stdout) {
    output += chunk;
  }

  const exitCode = await new Promise<number>((resolve, reject) => {
    process.on("close", resolve);
    process.on("error", reject);
  });

  if (exitCode !== 0) {
    throw new Error("Failed to fetch YouTube video info");
  }

  const info = JSON.parse(output);

  return info;
}
