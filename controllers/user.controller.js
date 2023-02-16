import express from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { validationResult } from "express-validator";
import UserModel from "../models/User.model.js";
import { registerValidator } from "../validations.js";
import checkAuth from "../utils/checkAuth.js";

const app = express();

export const register = app.post(
  "/auth/register",
  registerValidator,
  async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json(errors.array());
      // }

      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123",
        {
          expiresIn: "30d",
        }
      );

      const { passwordHash, ...userData } = user._doc;

      res.json({
        ...userData,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "НЕ УДАЛОСЬ ЗАРЕГЕСТРИРОВАТЬСЯ" });
    }
  }
);

export const login = app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "НЕВЕРНЫЙ ПАРОЛЬ ИЛИ ЛОГИН",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "НЕ УДАЛОСЬ АВТОРИЗОВАТЬСЯ" });
  }
});

export const getMe = app.get("/auth/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "ПОЛЬЗОВАТЕЛЬ  НЕ НАЙДЕН",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(error);
    res.status(500).json({ message: "НЕТ ДОСТУПА" });
  }
});
