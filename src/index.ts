import { serve } from "@hono/node-server";
import app from "./app.js";
import env from "./env.js";

const port = env.PORT;


serve({
  fetch: app.fetch,  
  port,
});
