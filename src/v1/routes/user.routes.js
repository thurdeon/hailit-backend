import express from 'express';
import {isAdminOrUserAuth} from '../../auth/user-auth/isAdminOrUser.js';
import { isUserRole } from '../../auth/user-auth/isUserRole.js';
import { supaAuth } from '../../auth/supaAuth.js'
import { addUser, deleteUser, getAllUsers, getOneUser, updateUser } from '../../controllers/user.controller.js';
import {userRoleValidation} from '../../validation/userRoleValidation.js';
import {addingAdminAuth} from '../../auth/user-auth/addingAdminAuth.js';



export const userRouter = express.Router();


userRouter.get('/', supaAuth, getAllUsers)

userRouter.get('/:userId', supaAuth, getOneUser)

userRouter.post('/register', addUser)

userRouter.put('/:userId', supaAuth,  updateUser)

userRouter.delete('/:userId', supaAuth, isUserRole, deleteUser)
