import { Request, Response } from "express";
import usermodel from "../../models/usermodel";
import {
  bcryptPassword,
  comparePassword,
  generateAccessToken,
} from "../../helper/helperFunction";
import { errorResponse, successResponse } from "../../helper/serverResponse";

export const signincontroller = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Some params are missing");
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return errorResponse(res, 404, "Email does not exist");
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return errorResponse(res, 401, "Invalid password");
    }

    const userId = user._id.toString();

    const { encoded_token, public_token } = generateAccessToken(
      userId,
      user.email,
      user.role
    );

    return successResponse(res, "SignIn successfully", {
      encoded_token,
      public_token,
      role: user.role,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export const signupcontroller = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, mobile, password } = req.body;

    if (!firstname || !lastname || !email || !mobile || !password) {
      return errorResponse(res, 400, "Some params are missing");
    }

    const existingUser = await usermodel.findOne({ email });

    if (existingUser) {
      return errorResponse(res, 400, "Email already registered");
    }

    const hashedPassword = await bcryptPassword(password);

    const newUser = await usermodel.create({
      firstname,
      lastname,
      email,
      mobile,
      password: hashedPassword,
    });

    return successResponse(res, "Signup successfully", newUser);
  } catch (error) {
    console.error("Signup Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
