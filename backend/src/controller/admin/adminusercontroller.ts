import { Request, Response } from "express";
import usermodel from "../../models/usermodel";
import { successResponse, errorResponse } from "../../helper/serverResponse";

export const getusersHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await usermodel
      .find({ role: "user" })
      .sort({ createdAt: -1 });

    successResponse(res, "Success", tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};
