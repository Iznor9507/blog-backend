import mongoose from "mongoose";
import express from "express";
import * as userController from "./controllers/user.controller.js";
import checkAuth from "./utils/checkAuth.js";
import {
  registerValidator,
  loginValidaton,
  postCreateValidation,
} from "./validations.js";
import * as PostController from "./controllers/post.controller.js";
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});




const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidaton,
  handleValidationErrors,
  userController.login
);
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  userController.register
);
app.get("/auth/me", checkAuth, userController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
// app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

mongoose.connect(
  "mongodb+srv://iznor:hucuev95_95@cluster0.u5yadld.mongodb.net/blog?retryWrites=true&w=majority",
  (err) => {
    if (err) {
      return console.log("ОШИБКА ПОДКЛЮЧЕНИЯ К СЕРВЕРУ МОНГО");
    } else {
      console.log("ВЫ ПОДКЛЮЧИЛИСЬ К СЕРВЕРУ МОНГО");
    }
  }
);

app.listen(port, (req, res) => {
  console.log("СЕРВЕР ЗАПУШЕН");
});
