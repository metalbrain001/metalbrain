import express from 'express';
import {
  loginUser,
  logoutOutUser,
  registerUser,
  userTokenRefresh,
} from '../../controllers/user/authUserController.js';
import { currentUser } from '../../controllers/user/currentUser.js';
import {
  allUsers,
  getUserById,
} from '../../controllers/user/userController.js';
import { verifyUser } from '../../middlewares/verifyUser.js';

const router = express.Router();

// **The User Registration Route** //
router.post('/api/registeruser', registerUser);

// **The User Login Route** //
router.post('/api/loginuser', loginUser);

// ** The User Refresh Token Route ** //
router.post('/api/refreshusertoken', userTokenRefresh);

// ** The User Logout Route ** //
router.post('/api/logoutuser', logoutOutUser);

// ** The get current user route ** //
router.get('/api/currentuser', verifyUser, currentUser);

// ** The get user by id route ** //
router.get('/api/getUserbyId/:user_id', getUserById);

// ** The Get all Users Route ** //
router.get('/api/allusers', verifyUser, allUsers);

export default router;
