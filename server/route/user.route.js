import  { Router } from 'express';
import {createUser} from '../controller/user.controller.js';

const userrouter = Router();

userrouter.post('/create', createUser);

export default userrouter;