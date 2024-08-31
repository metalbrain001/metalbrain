import { Request, Response } from 'express';
import { jwtAdminENV } from '../../config/jwtAdminENV.js';
import Admin from '../../sequelize/models/admin/admin.model.js';
import AdminRegistration from '../../sequelize/models/admin/adminregistration.model.js';
import { errorHandler } from '../../services/errorHandler.js';
import { IRole } from '../../types/index.js';
import {
  generateAdminJWT,
  generateAdminRefreshToken,
  verifyAdminJWT,
} from './jwtAdminGenerator.js';

// ** Admin Registration API ** //
// ** The Admin Registration function registers a new admin ** //
// ** The Admin Registration function ** //
export const adminRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  // ** Create a new admin ** //
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    console.log('Admin Registration:', req.body);

    const role: IRole = 'admin';
    if (role !== 'admin') {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const adminExists = await Admin.findOne({
      where: { email: req.body.email },
    });
    if (adminExists) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const admin = await AdminRegistration.create({
      new_admin: name,
      username: username,
      email: email,
      password: password,
      role: role,
      created_at: new Date(),
    });

    const admintoken = generateAdminJWT({ id: admin.id, role: admin.role });
    console.log('Admin Token:', admintoken);
    res.cookie('adminJwt', admintoken, {
      httpOnly: jwtAdminENV.JWT_COOKIE_HTTP_ONLY as boolean,
      maxAge: jwtAdminENV.JWT_ADMIN_MAX_AGE * 1000,
      secure: jwtAdminENV.JWT_COOKIE_SECURE,
      sameSite: 'strict',
      expires: new Date(
        Date.now() + jwtAdminENV.JWT_COOKIE_EXPIRES_IN_ADMIN_REGISTRATION
      ),
    });

    if (admin) {
      res.status(201).json({
        message: 'Admin created successfully',
        admin: {
          id: admin.id,
          name: admin.new_admin,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          created_at: admin.created_at,
        },
      });
    } else {
      res.status(400).json({ message: 'Admin creation failed' });
    }
  } catch (error) {
    console.log('Error creating admin from API', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Admin Login API ** //
// ** The Admin Login function logs in an admin ** //
// ** The Admin Login function ** //
export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const admin = await AdminRegistration.loginAdmin(email, password);
    if (!admin) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const admintoken = generateAdminJWT({ id: admin.id, role: admin.role });
    const adminrefreshToken = generateAdminRefreshToken({
      id: admin.id,
      role: admin.role,
    });

    res.cookie('adminJwt', admintoken, {
      httpOnly: jwtAdminENV.JWT_COOKIE_HTTP_ONLY as boolean,
      maxAge: jwtAdminENV.JWT_ADMIN_MAX_AGE * 1000,
      secure: jwtAdminENV.JWT_COOKIE_SECURE,
      sameSite: 'strict',
      expires: new Date(
        Date.now() + jwtAdminENV.JWT_COOKIE_EXPIRES_IN_ADMIN_REGISTRATION
      ),
    });

    res.cookie('adminRefreshToken', adminrefreshToken, {
      httpOnly: jwtAdminENV.JWT_COOKIE_HTTP_ONLY as boolean,
      maxAge: jwtAdminENV.JWT_ADMIN_MAX_AGE * 1000,
      secure: jwtAdminENV.JWT_COOKIE_SECURE,
      sameSite: 'strict',
      expires: new Date(Date.now() + jwtAdminENV.JWT_REFRESH_ADMIN_EXPIRES_IN),
    });

    res.status(200).json({
      message: 'Admin logged in successfully',
      admin: {
        id: admin.id,
        name: admin.new_admin,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        created_at: admin.created_at,
        token: {
          admin: admintoken,
          adminRefreshToken: adminrefreshToken,
        },
      },
    });
  } catch (error) {
    console.log('Error logging in admin', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Admin Token Refresh API ** //
// ** The Admin Token Refresh function refreshes the admin token ** //
// ** The Admin Token Refresh function ** //
export const adminTokenRefresh = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminrefreshToken = req.cookies.adminRefreshToken;
    if (!adminrefreshToken) {
      res.status(400).json({ message: 'No refresh token found' });
      return;
    }

    let admin: any;

    try {
      admin = verifyAdminJWT(adminrefreshToken);
      if (admin) {
        const adminrefreshToken = generateAdminRefreshToken(admin);

        res.cookie('adminRefreshToken', adminrefreshToken, {
          httpOnly: jwtAdminENV.JWT_COOKIE_HTTP_ONLY as boolean,
          maxAge: jwtAdminENV.JWT_ADMIN_MAX_AGE * 1000,
          secure: jwtAdminENV.JWT_COOKIE_SECURE,
          sameSite: 'strict',
          expires: new Date(
            Date.now() + jwtAdminENV.JWT_REFRESH_ADMIN_EXPIRES_IN
          ),
        });

        res.status(200).json({
          message: 'Token refreshed successfully',
          refreshTokens: {
            adminRefreshToken: adminrefreshToken,
          },
        });
      } else {
        res.status(400).json({ message: 'Cannot refresh Invalid Token!' });
      }
    } catch (error) {
      console.log('Error verifying admin token', error);
      res.status(400).json({ message: 'Invalid Token' });
      return;
    }

    return;
  } catch (error) {
    console.log('Error refreshing admin token', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Admin Logout API ** //
// ** The Admin Logout function logs out an admin ** //
// ** The Admin Logout function ** //
export const adminLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminToken = req.cookies.adminJwt;
    const adminRefreshToken = req.cookies.adminRefreshToken;
    if (!adminToken || !adminRefreshToken) {
      res.status(400).json({ message: 'No token found' });
      return;
    }
    res.clearCookie('adminJwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1,
    });
    res.clearCookie('adminRefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1,
    });
    res.status(200).json({ message: 'Admin logged out successfully' });
  } catch (error: any) {
    errorHandler(error, res);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  adminRegistration,
  adminLogin,
  adminTokenRefresh,
  adminLogout,
};
