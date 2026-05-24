import type { H3Event, EventHandlerRequest } from "h3";
import { auth } from "./auth";

type EventHandlerWithSession<T extends EventHandlerRequest, D> = (
  event: H3Event<T>,
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>,
) => Promise<D>;

export function defineAdminEventHandler<T extends EventHandlerRequest, D>(
  handler: EventHandlerWithSession<T, D>,
) {
  return defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session?.user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    if (session.user.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
    return handler(event, session);
  });
}
