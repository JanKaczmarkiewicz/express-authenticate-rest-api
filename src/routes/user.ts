import express, { RequestHandler } from "express";
import bcrypt from "bcryptjs";

//midlleware
import { validate, check } from "../middleware/validate";
import { auth } from "../middleware/auth";

//model
import User from "../Models/User";

//utils
import { send } from "../utils/responce";
import { createToken } from "./auth";

//type
import { AuthRequest } from "../types";

const router = express.Router();

type UserData = {
  name: string;
  email: string;
};

/**
 * @route GET /api/user
 * @desc Get user data
 * @access private
 */
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    if (req.userId) {
      const userData = await User.findById(req.userId);

      if (!userData) {
        send("ERROR", 400, "Please log in again.");
        return;
      }

      send("DATA", 200, {
        name: userData.name,
        email: userData.email
      } as UserData);
    }
  } catch (error) {
    console.error(error);
  }
});

/**
 * @route POST /api/user
 * @desc Create new user
 * @returns auth token
 * @access public
 */
router.post("/", [check.name, check.password, check.phone, validate], (async (
  req,
  res
) => {
  const { phone, password, name } = req.body;

  try {
    const foundUser = await User.findOne({ phone });

    if (foundUser) {
      send("ERROR", 400, "User already exist!");
      return;
    }

    const salt: string = await bcrypt.genSalt();

    const hash: string = await bcrypt.hash(password, salt);

    const user = new User({
      password: hash,
      phone,
      name
    });

    const savedUser = await user.save();

    const token: string = createToken(savedUser._id);

    send("DATA", 200, token);
  } catch (error) {
    console.error(error);
  }
}) as RequestHandler);

export default router;
