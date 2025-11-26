import { Request, Response } from "express";
import taskmodel, { ITask } from "../../models/taskmodel";
import { errorResponse, successResponse } from "../../helper/serverResponse";
import usermodel from "../../models/usermodel";

interface GetAllBlogBody {
  pageno?: number;
  filterBy?: Record<string, any>;
  sortby?: Record<string, "asc" | "desc">;
  search?: string;
}

export const getalltaskHandler = async (
  req: Request<{}, {}, GetAllBlogBody>,
  res: Response
): Promise<void> => {
  try {
    const { pageno = 0, filterBy = {}, sortby = {}, search = "" } = req.body;

    const limit = 10;
    const skip = pageno * limit;

    let query: Record<string, any> = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    if (filterBy && Object.keys(filterBy).length > 0) {
      query = {
        ...query,
        ...filterBy,
      };
    }

    const sortBy: Record<string, 1 | -1> =
      Object.keys(sortby).length !== 0
        ? Object.keys(sortby).reduce(
            (acc, key) => ({
              ...acc,
              [key]: sortby[key] === "asc" ? 1 : -1,
            }),
            {}
          )
        : { createdAt: -1 };

    const task: ITask[] = await taskmodel
      .find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const totalCount = await taskmodel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    successResponse(res, "Successfully fetched task", {
      task,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

interface CreateTaskBody {
  title: string;
  description?: string;
  userid: string;
}

export const createtaskHandler = async (
  req: Request<{}, {}, CreateTaskBody>,
  res: Response
): Promise<Response> => {
  try {
    const { title, description, userid } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const useridExist = await usermodel.findById({ _id: userid });
    if (!useridExist) {
      return errorResponse(res, 404, "userid not found");
    }

    const task: ITask = await taskmodel.create({
      title,
      description,
      userid,
    });

    return successResponse(res, "successfully created task", task);
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

interface updatetaskbody {
  _id: string;
  title?: string;
  description: string;
}

export const updatetaskHandler = async (
  req: Request<{}, {}, updatetaskbody>,
  res: Response
): Promise<void> => {
  try {
    const { _id, ...updatedData } = req.body;
    const options = { new: true };

    if (!_id) {
      errorResponse(res, 400, "Task ID is required");
      return;
    }
    // Validate required fields
    if (!updatedData.title || !updatedData.description) {
      errorResponse(res, 404, "Some params are missing");
      return;
    }

    const task: ITask | null = await taskmodel.findByIdAndUpdate(
      _id,
      updatedData,
      options
    );

    successResponse(res, "Successfully updated", task);
  } catch (error) {
    console.error("Error updating blog:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

interface DeleteTaskBody {
  _id: string;
}

export const deletetaskHandler = async (
  req: Request<{}, {}, DeleteTaskBody>,
  res: Response
): Promise<void> => {
  try {
    const { _id } = req.body;

    if (!_id) {
      errorResponse(res, 400, "Task ID is required");
      return;
    }

    const deletedTask: ITask | null = await taskmodel.findByIdAndDelete(_id);

    if (!deletedTask) {
      errorResponse(res, 404, "Task not found");
      return;
    }

    successResponse(res, "Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    errorResponse(res, 500, "Internal server error");
  }
};
