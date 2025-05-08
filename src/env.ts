import type { ZodError } from "zod";

import { z } from "zod";

const VEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
  APP_NAME: z.string(),
  API_VERSION: z.string(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().min(1024).max(65535).default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export type Env = z.infer<typeof VEnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let envData: Env;

try {
  // eslint-disable-next-line node/no-process-env
  envData = VEnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("❌ Invalid Env");
  console.error(error.flatten());
  process.exit(1);
}

export default envData;
