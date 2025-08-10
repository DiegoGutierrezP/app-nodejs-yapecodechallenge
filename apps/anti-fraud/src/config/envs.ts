import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  KAFKA_BROKER: string;
}

const envSchema = joi
  .object({
    KAFKA_BROKER: joi.string().required(),
  })
  .unknown(true); //permite que haya otra variables "flotando"

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  kafkaBroker: envVars.KAFKA_BROKER,
};
