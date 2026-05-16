import { spawn } from "node:child_process";

export default async function getYouTubeVideoInfo(url: string) {
  const process = spawn("yt-dlp", ["--dump-single-json", "--no-playlist", url]);

  let output = "";

  for await (const chunk of process.stdout) {
    output += chunk;
  }

  const info = JSON.parse(output);

  return info;
}
