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

export const deleteuserHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await usermodel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return errorResponse(res, 404, "User not found");
    }

    successResponse(res, "User deleted successfully");
  } catch (error) {
    console.error("Delete User Error:", error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
