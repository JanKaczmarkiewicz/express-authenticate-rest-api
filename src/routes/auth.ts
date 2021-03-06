import express, { RequestHandler } from "express";
import bcrypt from "bcryptjs";

import { validate, check } from "../middleware/validate";

import User from "../Models/User";
import { send, createToken } from "../utils/responce";

const router = express.Router();

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
