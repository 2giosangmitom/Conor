import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient();

export const { useSession, signOut, signIn } = authClient;
