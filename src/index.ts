import express from "express";
import { calculateImage, makePlan } from "./openAI";
import dotenv from "dotenv";
import { transformStringToJSON } from "./utils";
import { PORT } from "./constants";
import cors from "cors";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/images", upload.single("file"), async (req, res) => {
  const filePath = req?.file?.path;

  if (!filePath) {
    return "";
  }

  const fileBuffer = fs.readFileSync(filePath);
  const base64String = fileBuffer.toString("base64");
  fs.unlinkSync(filePath);

  const result = await calculateImage(base64String);

  return res.status(200).send({
    data: transformStringToJSON(result ?? "{}"),
    error: {},
  });
});

app.post("/plans", async (req, res) => {
  const body = req.body;
  let result = await makePlan(body);

  return res.status(200).send({
    data: transformStringToJSON(result),
    error: {},
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
