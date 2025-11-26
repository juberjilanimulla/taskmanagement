import { Request, Response } from "express";
import taskmodel, { ITask } from "../../models/taskmodel";
import { successResponse, errorResponse } from "../../helper/serverResponse";

export const createusertaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.id;
    const { title, description } = req.body;

    if (!title || !description) {
      return errorResponse(res, 400, "Title and description required");
    }

    const task = await taskmodel.create({
      userid: userId,
      title,
      description,
    });

    successResponse(res, "Task created", task);
  } catch (error) {
    console.error("Create Task Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const getallusertaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.id;
    const tasks = await taskmodel
      .find({ userid: userId })
      .sort({ createdAt: -1 });

    successResponse(res, "Success", tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const updateusertaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.id;
    const taskId = req.params.id;
    const { title, description } = req.body;

    if (!title && !description) {
      return errorResponse(res, 400, "Nothing to update");
    }

    const task: ITask | null = await taskmodel.findOne({
      _id: taskId,
      userid: userId,
    });

    if (!task) {
      return errorResponse(res, 404, "Task not found or unauthorized");
    }

    if (title) task.title = title;
    if (description) task.description = description;

    const updatedTask = await task.save();

    successResponse(res, "Task updated", updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};

export const deleteusertaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.id;
    const taskId = req.params.id;

    const deletedTask = await taskmodel.findOneAndDelete({
      _id: taskId,
      userid: userId,
    });

    if (!deletedTask) {
      return errorResponse(res, 404, "Task not found or unauthorized");
    }

    successResponse(res, "Task deleted");
  } catch (error) {
    console.error("Delete Task Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
};
