import express, { Request, Response, NextFunction } from "express";
import dbConnect from "./config/db";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/config";
import {
  Admin,
  authMiddleware,
  isAdminMiddleware,
} from "./helper/helperFunction";
import authRouter from "./routes/auth/authRouter";
import adminRouter from "./routes/admin/adminRouter";
import userRouter from "./routes/user/userRouter";

const app = express();
const port = config.PORT || 5000;

app.set("trust proxy", true);

morgan.token("remote-addr", (req: Request, _res: Response): string => {
  return (
    (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || ""
  );
});

morgan.token("url", (req: Request) => {
  return req.originalUrl;
});

app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Internal Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", authMiddleware, isAdminMiddleware, adminRouter);
app.use("/api/user", authMiddleware, userRouter);

dbConnect()
  .then(() => {
    Admin();
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch(() => {
    console.error("Unable to connect to database");
  });

export default app;
