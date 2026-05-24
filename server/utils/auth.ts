import { db, schema } from "@nuxthub/db";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { kv } from "@nuxthub/kv";
import type { H3Event } from "h3";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"] as const,
        returned: true,
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  rateLimit: {
    storage: "secondary-storage",
  },
  secondaryStorage: {
    get(key) {
      return kv.get(key);
    },
    set(key, value) {
      return kv.set(key, value);
    },
    delete(key) {
      return kv.del(key);
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

type EventHandlerWithSession<T extends EventHandlerRequest, D> = (
  event: H3Event<T>,
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>,
) => Promise<D>;

export function defineProtectedEventHandler<T extends EventHandlerRequest, D>(
  handler: EventHandlerWithSession<T, D>,
) {
  return defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session?.user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    return handler(event, session);
  });
}
