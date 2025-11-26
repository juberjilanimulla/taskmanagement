import { Router } from "express";
import {
  createtaskHandler,
  deletetaskHandler,
  getalltaskHandler,
  updatetaskHandler,
} from "../../controller/admin/admintaskcontroller";

const usertaskRouter = Router();

usertaskRouter.get("/tasks", getalltaskHandler);
usertaskRouter.post("/create", createtaskHandler);
usertaskRouter.put("/update/:id", updatetaskHandler);
usertaskRouter.delete("/delete/:id", deletetaskHandler);

export default usertaskRouter;
