import { randomBytes } from 'crypto';

// Generate a secure 64-byte secret key (512 bits)
const secret = randomBytes(64).toString('hex');

console.log(`JWT_SECRET=${secret}`);
