import { body } from "express-validator";

export const loginValidaton = [
  body("email", "Нверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidator = [
  body("email", "Нверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 7,
  }),
  body("fullName", "Укажите полное ФИО").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тегов").optional().isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzOGY0MGIwNDZiMmE4OTdkYmU5YjEiLCJpYXQiOjE2NzU4NTc3MjksImV4cCI6MTY3ODQ0OTcyOX0.oRU1KDkYXBe9YhpL4WHNw94uY0CnhtDUoJPlAprrGsQ
