import { Router } from "express";
import {
  deleteusertasksHandler,
  createusertasksHandler,
  getusertasksHandler,
  updateusertasksHandler,
} from "../../controller/user/usercontroller";

const usertaskRouter = Router();

usertaskRouter.get("/", getusertasksHandler);
usertaskRouter.post("/create", createusertasksHandler);
usertaskRouter.put("/update/:id", updateusertasksHandler);
usertaskRouter.delete("/delete/:id", deleteusertasksHandler);

export default usertaskRouter;
