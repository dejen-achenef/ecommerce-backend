import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import pool from "./db.js";
import cookieParser from "cookie-parser";
import router from "./src/routes/routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/", router);
const id = uuidv4();
console.log(id);
const sendResponse = (res, { success, message, object, errors = null }) => {
  res.json({ success, message, object, errors });
};
const sendPaginatedResponse = (
  res,
  { success, message, object, pageNumber, pageSize, totalSize, errors = null }
) => {
  res.json({
    success,
    message,
    object,
    pageNumber,
    pageSize,
    totalSize,
    errors,
  });
};

console.log(sendResponse, sendPaginatedResponse);

app.listen(process.env.PORT, (req, res) => {
  console.log(`the server is running on port ${process.env.port}`);
});
