import { Router } from "express";
import {
  deleteuserHandler,
  getusersHandler,
} from "../../controller/admin/adminusercontroller";

const adminuserRouter = Router();

adminuserRouter.get("/", getusersHandler);
adminuserRouter.delete("/delete/:id", deleteuserHandler);

export default adminuserRouter;
