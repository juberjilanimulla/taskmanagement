import { Router } from "express";
import { getusersHandler } from "../../controller/admin/adminusercontroller";

const adminuserRouter = Router();

adminuserRouter.get("/", getusersHandler);

export default adminuserRouter;
