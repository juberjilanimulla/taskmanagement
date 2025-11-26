import { Response } from "express";

export function successResponse(
  res: Response,
  message: string,
  data: any = null
): Response {
  return res.status(200).json({
    status: 200,
    error: false,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string
): Response {
  return res.status(statusCode).json({
    status: statusCode,
    error: true,
    message,
    data: null,
  });
}
