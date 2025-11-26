import { Router } from "express";
import admintaskRouter from "./admintaskRouter";

const adminRouter = Router();

adminRouter.use("/task", admintaskRouter);

export default adminRouter;
