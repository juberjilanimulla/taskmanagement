import { Router } from "express";
import usertaskRouter from "./usertaskRouter";

const userRouter = Router();

userRouter.use("/tasks", usertaskRouter);

export default userRouter;
