import * as z from 'zod';

export const AdminSignUpValidation = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 2 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const AdminSignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const UserSignUpValidation = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 2 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 6 characters long' }),
});

export const UserSignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: 'Minimum 5 characters.' })
    .max(2200, { message: 'Maximum 2,200 caracters' }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: 'This field is required' })
    .max(1000, { message: 'Maximum 1000 characters.' }),
  tags: z.string(),
});

// ============================================================
// UserStory Image Validation
// ============================================================
export const UserStoryValidation = z.object({
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: 'This field is required' })
    .max(1000, { message: 'Maximum 1000 characters.' }),
});
