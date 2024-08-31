import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';

dotenv.config;

// ** JWT Generator ** //

// ** Generates a JWT for an admin ** //
export const generateUserJWT = (payload: any): string => {
  try {
    return jwt.sign(payload, jwtUserENV.JWT_USER_SECRET as string, {
      algorithm: jwtUserENV.JWT_ALGORITHM as jwt.Algorithm,
      expiresIn: jwtUserENV.JWT_EXPIRES_IN,
      issuer: jwtUserENV.JWT_ISSUER as string,
    });
  } catch (error) {
    throw new Error('Error generating JWT');
  }
};

// ** Verifies a JWT and returns the payload ** //
export const verifyUserJWT = (token: string): any => {
  try {
    return jwt.verify(token, jwtUserENV.JWT_USER_SECRET as string);
  } catch (error) {
    throw new Error('Invalid token! Please login again');
  }
};

// ** Generates a refresh token for an admin ** //
export const generateUserRefreshToken = (payload: any): string => {
  try {
    return jwt.sign(payload, jwtUserENV.JWT_REFRESH_USER_SECRET as string, {
      algorithm: jwtUserENV.JWT_ALGORITHM as jwt.Algorithm,
      expiresIn: jwtUserENV.JWT_EXPIRES_IN as string,
      issuer: jwtUserENV.JWT_ISSUER as string,
    });
  } catch (error) {
    throw new Error('Error generating refresh token');
  }
};

// ** Export the JwtUserGenerator class ** //
export default {
  generateUserJWT,
  generateUserRefreshToken,
  verifyUserJWT,
};
