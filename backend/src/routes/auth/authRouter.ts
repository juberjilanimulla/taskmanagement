import { Router } from "express";
import {
  signincontroller,
  signupcontroller,
} from "../../controller/auth/authcontroller";

const authRouter = Router();

authRouter.post("/signin", signincontroller);
authRouter.post("/signup", signupcontroller);

export default authRouter;
