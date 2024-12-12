import { Router } from "express";
import { login, register } from "../controllers/userController.js";
import { findOneUser, getAllUser, updateUser, deleteUser } from "../controllers/users.controllers.js"
import authMiddleware from "../middlewares/auth.middlewares.js"

const userRouter = Router();

userRouter.post('/register', register )
userRouter.post('/login', login)
userRouter.get('/:userId', findOneUser)
userRouter.get('/', getAllUser)
userRouter.put('/update/:userId', authMiddleware.authentication, updateUser)
userRouter.delete("/delete/:userId", authMiddleware.authentication, deleteUser);

export default userRouter;