import { runScheduledMetaIngest } from "./meta-scheduled.mjs";

export default {
  // Unchanged from static-only serving: every request is delegated to the
  // Asset Worker. This handler has no route, query, or binding that exposes
  // META_DB or any Meta credential to the public website.
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "menu.altrospazio.org" && url.pathname === "/") {
      return Response.redirect(url.origin + "/menu", 301);
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduledMetaIngest(env));
  },
};
