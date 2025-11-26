import { Router } from "express";
import {
  signincontroller,
  signupcontroller,
} from "../../controller/user/authcontroller";

const authRouter = Router();
authRouter.post("/signin", signincontroller);
authRouter.post("/signup", signupcontroller);
export default authRouter;
