import express from 'express';
import { login, register, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
import { getAccessToken } from '../controllers/tokenController.js';
const UserRouter = express.Router();

UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.get('/token', getAccessToken);
UserRouter.put('/profile/:id', verifyToken, updateProfile);


export default UserRouter;