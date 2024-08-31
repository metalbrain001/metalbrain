import { strict as assert } from 'assert';
import dotenv from 'dotenv';
import { load } from 'ts-dotenv';
// Load the .env file
dotenv.config();
// Load the environment variables
var env = load({
  PORT: Number,
  MORGAN: ['combined', 'dev', 'tiny'],
  TRUST_PROXY: String,
  NUMBER_OF_PROXIES: Number,
  IDLE_TIMEOUT: Number,
  COMPRESSION_LEVEL: Number,
  COMPRESSION_THRESHOLD: Number,
});
assert((env.PORT = 3000), 'PORT is required');
assert(env.MORGAN, 'MORGAN is required');
assert(env.TRUST_PROXY, 'TRUST_PROXY is required');
assert(env.NUMBER_OF_PROXIES, 'NUMBER_OF_PROXIES is required');
assert((env.IDLE_TIMEOUT = 580000), 'IDLE_TIMEOUT is required');
assert((env.COMPRESSION_LEVEL = 9), 'COMPRESSION_LEVEL is required');
assert(env.COMPRESSION_THRESHOLD, 'COMPRESSION_THRESHOLD is required');
var PORT = env.PORT,
  MORGAN = env.MORGAN,
  TRUST_PROXY = env.TRUST_PROXY,
  NUMBER_OF_PROXIES = env.NUMBER_OF_PROXIES,
  IDLE_TIMEOUT = env.IDLE_TIMEOUT,
  COMPRESSION_LEVEL = env.COMPRESSION_LEVEL,
  COMPRESSION_THRESHOLD = env.COMPRESSION_THRESHOLD;
export default {
  PORT: PORT,
  MORGAN: MORGAN,
  TRUST_PROXY: TRUST_PROXY,
  NUMBER_OF_PROXIES: NUMBER_OF_PROXIES,
  IDLE_TIMEOUT: IDLE_TIMEOUT,
  COMPRESSION_LEVEL: COMPRESSION_LEVEL,
  COMPRESSION_THRESHOLD: COMPRESSION_THRESHOLD,
};
export { env };
