import Joi from "joi";

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().default(5000),
  DATABASE_URL: Joi.string().uri().required(),
  accesskey: Joi.string().min(10).required(),
  refreshkey: Joi.string().min(10).required(),
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
}).unknown(true);

const { value: env, error } = envSchema.validate(process.env);

if (error) {
  // Throw early for misconfiguration
  throw new Error(`Invalid environment configuration: ${error.message}`);
}

export const config = {
  nodeEnv: env.NODE_ENV,
  isProd: env.NODE_ENV === "production",
  port: Number(env.PORT || 5000),
  dbUrl: env.DATABASE_URL,
  jwt: {
    accessKey: env.accesskey,
    refreshKey: env.refreshkey,
    accessTtl: "1h",
    refreshTtl: "7d",
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },
};
