import express, { RequestHandler } from "express";
import bcrypt from "bcryptjs";

//midlleware
import { validate, check } from "../middleware/validate";
import { auth } from "../middleware/auth";

//model
import User, { IUser } from "../Models/User";

//utils
import { send } from "../utils/responce";
import { createToken } from "../utils/responce";

//type
import { AuthRequest } from "../types";
import endpointTemplate, { Sanitizer } from "./template/crud";

const router = express.Router();

type UserData = {
  id: string;
  name: IUser["name"];
  phone: IUser["phone"];
  createdAt: IUser["createdAt"];
};

const sanitize: Sanitizer = ({
  _id,
  name,
  phone,
  createdAt
}: IUser): UserData => ({
  id: _id,
  name,
  phone,
  createdAt
});

const { getOne, getAll } = endpointTemplate(User, sanitize, []);
[getAll, getOne].forEach(attach => attach(router));

// router.put(
//   "/:id",
//   [auth, check["name"], validate],
//   async (req: AuthRequest) => {
//     const update = {
//       name: req.body.name,
//       creator: req.userId
//     };

//     try {
//       const updatedDocument = await Model.findOneAndUpdate(
//         {
//           _id: req.params.id
//         },
//         update,
//         {
//           new: true,
//           upsert: true
//         }
//       );

//       send("DATA", 200, sanitize(updatedDocument));
//     } catch (err) {
//       send("DATA", 404, "Write error.");
//     }
//   }
// );

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
