import { strict as assert } from 'assert';
import dotenv from 'dotenv';
import { load } from 'ts-dotenv';

// Load the .env file
dotenv.config();

// Load the environment variables
const env = load({
  PORT: Number,
  MORGAN: ['combined' as const, 'dev' as const, 'tiny' as const],
  TRUST_PROXY: String,
  NUMBER_OF_PROXIES: Number,
  IDLE_TIMEOUT: Number,
  COMPRESSION_LEVEL: Number,
  COMPRESSION_THRESHOLD: Number,
  NODE_ENV: ['development' as const, 'production' as const],
});

assert((env.PORT = 3000), 'PORT is required');
assert(env.MORGAN, 'MORGAN is required');
assert(env.TRUST_PROXY, 'TRUST_PROXY is required');
assert(env.NUMBER_OF_PROXIES, 'NUMBER_OF_PROXIES is required');
assert((env.IDLE_TIMEOUT = 580000), 'IDLE_TIMEOUT is required');
assert((env.COMPRESSION_LEVEL = 9), 'COMPRESSION_LEVEL is required');
assert(env.COMPRESSION_THRESHOLD, 'COMPRESSION_THRESHOLD is required');
assert(env.NODE_ENV, 'NODE_ENV is required');

const {
  PORT,
  MORGAN,
  TRUST_PROXY,
  NUMBER_OF_PROXIES,
  IDLE_TIMEOUT,
  COMPRESSION_LEVEL,
  COMPRESSION_THRESHOLD,
  NODE_ENV,
} = env;

export default {
  PORT,
  MORGAN,
  TRUST_PROXY,
  NUMBER_OF_PROXIES,
  IDLE_TIMEOUT,
  COMPRESSION_LEVEL,
  COMPRESSION_THRESHOLD,
  NODE_ENV,
};

export { env };
