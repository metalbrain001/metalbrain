import { strict as assert } from 'assert';
import dotenv from 'dotenv';
import { load } from 'ts-dotenv';

// Load the .env file
dotenv.config();

// Load the environment variables
const smtpSchema = load({
  SMTP_HOST: String,
  SMTP_PORT: Number,
  SMTP_USER: String,
  SMTP_PASS: String,
  SMTP_FROM: String,
});

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = smtpSchema;

assert(SMTP_HOST, 'SMTP_HOST is required');
assert(SMTP_PORT, 'SMTP_PORT is required');
assert(SMTP_USER, 'SMTP_USER is required');
assert(SMTP_PASS, 'SMTP_PASS is required');
assert(SMTP_FROM, 'SMTP_FROM is required');

export const smtpenv = {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
};

export default {
  smtpenv,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
};
