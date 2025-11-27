import { Router } from "express";
import adminuserRouter from "./adminuserRouter";

const adminRouter = Router();

adminRouter.use("/users", adminuserRouter);

export default adminRouter;
