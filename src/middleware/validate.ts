import { validationResult, ValidationChain } from "express-validator";
import { RequestHandler } from "express";
import { send } from "../utils/responce";
import { check } from "express-validator";

type Checks = {
  [key: string]: ValidationChain;
};

const checkFormat: Checks = {
  name: check("name", "Name is required.")
    .not()
    .isEmpty()
    .isString(),
  number: check("number", "Number is should be text.")
    .isString()
    .not()
    .isEmpty(),
  phone: check("phone", "Please include a valid phone number")
    .isMobilePhone("pl-PL")
    .not()
    .isEmpty(),
  password: check(
    "password",
    "Please enter a password with 6 or more characters."
  )
    .isLength({ min: 6, max: 30 })
    .not()
    .isEmpty()
};

export { checkFormat as check };

export const validate: RequestHandler = (req, res, next) => {
  console.log(req.body);
  const warnings = validationResult(req);

  if (!warnings.isEmpty()) {
    const sanitizedWarnings = warnings.array().map(el => el.msg);
    send("WARNING", 400, sanitizedWarnings);
    return;
  }
  next();
};
