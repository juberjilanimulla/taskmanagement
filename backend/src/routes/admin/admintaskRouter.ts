import { Router } from "express";
import {
  createtaskHandler,
  deletetaskHandler,
  getalltaskHandler,
  updatetaskHandler,
} from "../../controller/admin/admintaskcontroller";

const admintaskRouter = Router();

admintaskRouter.post("/getall", getalltaskHandler);
admintaskRouter.post("/create", createtaskHandler);
admintaskRouter.put("/update", updatetaskHandler);
admintaskRouter.delete("/delete", deletetaskHandler);

export default admintaskRouter;
