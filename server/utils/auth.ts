import { db, schema } from "@nuxthub/db";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { kv } from "@nuxthub/kv";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
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
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
