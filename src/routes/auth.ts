import express, { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { validate, check } from "../middleware/validate";

import User from "../Models/User";
import { send } from "../utils/responce";
import env from "../config/env";
const router = express.Router();

export const createToken = (id: string): string =>
  jwt.sign({ id }, env("PASSWORD_SECRET"), {
    expiresIn: "1h"
  });

const wrongDataEnteredMessage =
  "The password or phone number that have been entered is incorrect.";

/**
 * @route POST /api/auth
 * @desc Endpoint for user logging
 * @returns auth token
 * @access private
 */
router.post("/", [check.phone, check.password, validate], (async (req, res) => {
  const { phone, password } = req.body;

  const foundUser = await User.findOne({ phone });

  if (!foundUser) {
    send("ERROR", 401, wrongDataEnteredMessage);
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordCorrect) {
    send("ERROR", 400, wrongDataEnteredMessage);
    return;
  }

  const token: string = createToken(foundUser._id);

  send("DATA", 200, token);
}) as RequestHandler);

export default router;
