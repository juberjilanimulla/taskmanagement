import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction, response } from "express";
import { errorResponse } from "./serverResponse";
import usermodel from "../models/usermodel";

const secretKey: string = crypto.randomBytes(48).toString("hex");

export function generateAccessToken(
  id: string,
  email: string,
  role: string
): { encoded_token: string; public_token: string } {
  const tokenPayload = { id, email, role };

  const encoded_token = jwt.sign(tokenPayload, secretKey, {
    expiresIn: "2h",
  });

  const public_token = jwt.sign(tokenPayload, secretKey, {
    expiresIn: "1d",
  });

  return { encoded_token, public_token };
}

export function validateToken(token: string): JwtPayload | string {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw error;
  }
}

export function isAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const role = res.locals.role;

  if (!role || role !== "admin") {
    errorResponse(res, 403, "User not authorized");
    return;
  }

  next();
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader =
    req.headers.authorization || req.headers.Authorization || req.query.token;

  if (!authHeader || typeof authHeader !== "string") {
    errorResponse(res, 401, "Token not found");
    return;
  }

  const encoded_token = authHeader.split(" ")[1];

  if (!encoded_token) {
    errorResponse(res, 401, "Unauthorized user");
    return;
  }

  try {
    const decoded = jwt.verify(encoded_token, secretKey) as JwtPayload;

    if (!decoded.role || !decoded.email) {
      errorResponse(res, 401, "Unauthorized user");
    }

    res.locals.id = decoded.id;
    res.locals.role = decoded.role;
    res.locals.email = decoded.email;

    next();
  } catch (error: any) {
    errorResponse(res, 401, "Invalid token");
  }
}

export function bcryptPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed);
}

const sessions: Map<string, string> = new Map();

export function createSession(id: string): string {
  const sessionId = uuidv4();
  sessions.set(id, sessionId);
  return sessionId;
}

export function getSessionData(id: string): string | null {
  return sessions.get(id) || null;
}

export function deleteSession(id: string): boolean {
  return sessions.delete(id);
}

export async function Admin(): Promise<void> {
  const adminEmails = process.env.ADMIN?.split(",") || [];

  for (const email of adminEmails) {
    const exists = await usermodel.findOne({ email });

    if (!exists) {
      await usermodel.create({
        firstname: "admin",
        lastname: "admin",
        email,
        role: "admin",
        mobile: "+123456789",
        password: bcryptPassword("1234"),
      });
    }
  }
}
