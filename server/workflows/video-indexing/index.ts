import { getInfo, checkDuration, checkLanguage, generateTranscript, analyzeVideo } from "./steps";

export async function handleIndexVideo(youtubeId: string) {
  "use workflow";

  try {
    const info = await getInfo(youtubeId);
    await checkDuration(info);
    await checkLanguage(info);
    const subtitles = await generateTranscript(info);
    await analyzeVideo(subtitles, {
      title: info.title,
      tags: info.tags,
    });

    return info;
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
