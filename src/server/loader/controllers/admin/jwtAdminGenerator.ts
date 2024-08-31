import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { jwtAdminENV } from '../../config/jwtAdminENV.js';
dotenv.config;

// ** JWT Admin Generator ** //
// ** The JWT Admin Generator is a utility class that generates a JSON Web Token (JWT) for an admin. ** //
// ** Generates a JWT for an admin ** //
export async function generateAdminJWT(admin: any): Promise<string> {
  const payload = {
    id: admin.id,
    role: admin.role,
  };
  try {
    const token = jwt.sign(payload, jwtAdminENV.JWT_ADMIN_SECRET as string, {
      expiresIn: jwtAdminENV.JWT_COOKIE_EXPIRES_IN_ADMIN_REGISTRATION,
      issuer: jwtAdminENV.JWT_ISSUER as string,
    });
    return token;
  } catch (error) {
    throw new Error('Error generating JWT');
  }
}

// ** Generates a refresh token for an admin ** //
export async function generateAdminRefreshToken(admin: any): Promise<string> {
  const payload = {
    id: admin.id,
    role: admin.role,
  };
  try {
    const token = jwt.sign(
      payload,
      jwtAdminENV.JWT_REFRESH_ADMIN_SECRET as string,
      {
        expiresIn: jwtAdminENV.JWT_EXPIRES_IN as string,
        issuer: jwtAdminENV.JWT_ISSUER as string,
      }
    );
    return token;
  } catch (error) {
    throw new Error('Error generating refresh token');
  }
}

// ** Verifies a JWT and returns the payload ** //
export async function verifyAdminJWT(token: string): Promise<any> {
  try {
    const payload = jwt.verify(token, jwtAdminENV.JWT_ADMIN_SECRET as string);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default {
  generateAdminJWT,
  generateAdminRefreshToken,
  verifyAdminJWT,
};
