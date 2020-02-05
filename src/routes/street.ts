import express, { RequestHandler } from "express";
import { check } from "express-validator";

import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";

import Street, { IStreet } from "../Models/Street";
import { send } from "../utils/responce";
import { AuthRequest } from "../types";
import User from "../Models/User";

const router = express.Router();

type SanitizedObject = {
  name: IStreet["name"];
  creator: IStreet["creator"];
  createdAt: IStreet["createdAt"];
};
const sanitize = ({ name, creator, createdAt }: IStreet): SanitizedObject => ({
  name,
  createdAt,
  creator
});

/**
 * @route GET /api/streets
 * @desc Get all streets
 * @returns all Streets
 * @access public
 */
router.get("/", (async (req, res) => {
  try {
    const streets = await Street.find();

    if (!streets) {
      send("ERROR", 404, "No data found.");
      return;
    }

    const streetResult = streets.map(sanitize);
    send("DATA", 200, streetResult);
  } catch (err) {
    console.log(err);
    send("ERROR", 200, "Data unreachable.");
  }
}) as RequestHandler);

/**
 * @route GET /api/streets
 * @desc Get single street
 * @returns Street with specefied id
 * @access public
 */
router.get("/:id", (async (req, res) => {
  try {
    const street = await Street.findOne({ _id: req.params.id });

    if (!street) {
      send("ERROR", 404, "No data found.");
      return;
    }

    const streetResult = sanitize(street);

    send("DATA", 200, streetResult);
  } catch (err) {
    send("ERROR", 200, "Data unreachable.");
  }
}) as RequestHandler);

/**
 * @route POST /api/Streets
 * @desc Add Street
 * @access private
 */
router.post(
  "/",
  [
    auth,
    check("name", "Please privide name of street.")
      .not()
      .isEmpty(),
    validate
  ],
  (async (req: AuthRequest, res) => {
    const userId = req.userId;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      send("ERROR", 404, "User id in token is inappropriate.");
    }

    const { name } = req.body;

    const street = new Street({
      creator: userId,
      name
    });

    try {
      const streetDocument = await street.save();
      const resultStreet = sanitize(streetDocument);
      send("DATA", 200, resultStreet);
    } catch (err) {
      send("DATA", 404, "Write error.");
    }
  }) as RequestHandler
);

/**
 * @route PUT /api/Streets
 * @desc Update Street
 * @access private
 */
router.put(
  "/:id",
  [auth, check("name", "Please privide name of Street.").optional(), validate],
  (async (req: AuthRequest, res) => {
    const update = {
      name: req.body.name,
      creator: req.userId
    };

    try {
      const updatedStreet = await Street.findOneAndUpdate(
        {
          _id: req.params.id
        },
        update,
        {
          new: true,
          upsert: true
        }
      );

      const street = sanitize(updatedStreet);

      send("DATA", 200, street);
    } catch (err) {
      send("DATA", 404, "Write error.");
    }
  }) as RequestHandler
);

/**
 * @route DELETE /api/Streets
 * @desc Update Street
 * @access private
 */
router.delete("/:id", auth, async (req, res) => {
  const street = await Street.findOneAndRemove({
    _id: req.params.id
  });

  if (!street) {
    send("ERROR", 404, "No data found.");
    return;
  }

  res.status(200).send({
    msg: "Sucessfully removed record."
  });
});

export default router;
