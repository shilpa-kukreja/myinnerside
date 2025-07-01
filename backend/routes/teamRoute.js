import express from 'express';
import {  teamlogin } from '../controllers/teamController.js';


const teamRouter = express.Router();

teamRouter.post('/login',teamlogin)
 


export default teamRouter;