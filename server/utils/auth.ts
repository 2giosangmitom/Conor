import { db } from "@nuxthub/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { kv } from "@nuxthub/kv";

const config = useRuntimeConfig();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
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
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    },
  },
});
