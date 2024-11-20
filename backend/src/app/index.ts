import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "../routes";

dotenv.config();

const app = express();

app.use(cors(), bodyParser.json(), cookieParser());

app.use("/api/user", userRouter);

// healthCheck
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "server running fine",
  });
});
export default app;
