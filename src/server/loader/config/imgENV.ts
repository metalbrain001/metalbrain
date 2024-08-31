import { strict as assert } from 'assert';
import dotenv from 'dotenv';
import { load } from 'ts-dotenv';

// Load the .env file
dotenv.config();

// Load the environment variables
const imgSchema = load({
  UPLOAD_IMAGE_DIR: String,
  UPLOAD_STORIES_URL: String,
  UPLOAD_PROFILE_PIC_URL: String,
});

const { UPLOAD_IMAGE_DIR, UPLOAD_STORIES_URL, UPLOAD_PROFILE_PIC_URL } =
  imgSchema;

assert(UPLOAD_IMAGE_DIR, 'UPLOAD_IMAGE_DIR is required');
assert(UPLOAD_STORIES_URL, 'UPLOAD_STORIES_URL is required');
assert(UPLOAD_PROFILE_PIC_URL, 'UPLOAD_PROFILE_PIC_URL is required');

export const imgenv = {
  UPLOAD_IMAGE_DIR,
  UPLOAD_STORIES_URL,
  UPLOAD_PROFILE_PIC_URL,
};

export default {
  imgenv,
  UPLOAD_IMAGE_DIR,
  UPLOAD_STORIES_URL,
  UPLOAD_PROFILE_PIC_URL,
};
