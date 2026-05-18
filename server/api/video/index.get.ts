import { db, schema } from "@nuxthub/db";
import { and, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  sort: z.enum(["trending", "newest"]).default("newest"),
  period: z.enum(["7d", "30d", "90d", "all"]).default("all"),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  topic: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  minDuration: z.coerce.number().min(0).optional(),
  maxDuration: z.coerce.number().min(0).optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().min(0).default(0),
});

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse);

  const conditions = [];

  if (query.level) {
    conditions.push(eq(schema.video.level, query.level));
  }

  if (query.topic) {
    conditions.push(eq(schema.video.topic, query.topic));
  }

  if (query.q) {
    conditions.push(ilike(schema.video.title, `%${query.q}%`));
  }

  if (query.minDuration !== undefined) {
    conditions.push(gte(schema.video.duration, query.minDuration));
  }

  if (query.maxDuration !== undefined) {
    conditions.push(lte(schema.video.duration, query.maxDuration));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  if (query.sort === "trending") {
    const days = PERIOD_DAYS[query.period];
    const cutoffDate = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;

    const trendingConditions = [...conditions];
    if (cutoffDate) {
      trendingConditions.push(gte(schema.practiceSession.createdAt, cutoffDate));
    }
    const trendingWhere = trendingConditions.length > 0 ? and(...trendingConditions) : undefined;

    const [totalResult] = await db
      .select({ total: count(schema.video.id) })
      .from(schema.video)
      .leftJoin(schema.practiceSession, eq(schema.video.id, schema.practiceSession.videoId))
      .where(trendingWhere);

    const practiceCount = count(schema.practiceSession.id);

    const videos = await db
      .select({
        id: schema.video.id,
        title: schema.video.title,
        youtubeId: schema.video.youtubeId,
        duration: schema.video.duration,
        topic: schema.video.topic,
        level: schema.video.level,
        thumbnailUrl: schema.video.thumbnailUrl,
        createdAt: schema.video.createdAt,
        updatedAt: schema.video.updatedAt,
        practiceCount,
      })
      .from(schema.video)
      .leftJoin(schema.practiceSession, eq(schema.video.id, schema.practiceSession.videoId))
      .where(trendingWhere)
      .groupBy(schema.video.id)
      .orderBy(desc(practiceCount), desc(schema.video.createdAt))
      .limit(query.limit)
      .offset(query.offset);

    return {
      videos,
      total: totalResult?.total ?? 0,
    };
  }

  const [totalResult] = await db.select({ total: count() }).from(schema.video).where(whereClause);

  const videos = await db
    .select({
      id: schema.video.id,
      title: schema.video.title,
      youtubeId: schema.video.youtubeId,
      duration: schema.video.duration,
      topic: schema.video.topic,
      level: schema.video.level,
      thumbnailUrl: schema.video.thumbnailUrl,
      createdAt: schema.video.createdAt,
      updatedAt: schema.video.updatedAt,
    })
    .from(schema.video)
    .where(whereClause)
    .orderBy(desc(schema.video.createdAt))
    .limit(query.limit)
    .offset(query.offset);

  return {
    videos,
    total: totalResult?.total ?? 0,
  };
});
