import express from 'express';

import { register, loginUser, forgotPassword, resetPassword, editUser, getUser, getallUser, removeUser} from '../controllers/authControler.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const authRouter = express.Router();


authRouter.post('/register', register);
authRouter.post('/login', loginUser);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);
authRouter.patch('/edit', authUser, upload.single('image'), editUser);
authRouter.post('/user', authUser ,getUser);
authRouter.get('/all',getallUser); 
authRouter.delete('/:id',removeUser);




export default authRouter;