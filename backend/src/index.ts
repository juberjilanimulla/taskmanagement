import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Task Management API (TypeScript) Running...");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
