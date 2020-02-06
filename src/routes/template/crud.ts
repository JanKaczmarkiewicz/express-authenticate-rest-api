import express from "express";

import { auth } from "../../middleware/auth";
import { validate, check } from "../../middleware/validate";

import { send } from "../../utils/responce";
import { AuthRequest } from "../../types";
import User from "../../Models/User";
import { Model } from "mongoose";

export interface Sanitizer {
  (document: any): any;
}

const CRUDRoute = (Model: Model<any>, sanitize: Sanitizer) => {
  const router = express.Router();

  /**
   * @route GET /api/<route_name>
   * @desc Get all <route_name>
   * @returns all <route_name>s
   * @access public
   */
  router.get("/", async () => {
    try {
      const results = await Model.find();

      if (!results) {
        send("ERROR", 404, "No data found.");
        return;
      }

      send("DATA", 200, results.map(sanitize));
    } catch (err) {
      console.log(err);
      send("ERROR", 200, "Data unreachable.");
    }
  });

  /**
   * @route GET /api/<route_name>
   * @desc Get single <route_name>
   * @returns <route_name> with specefied id
   * @access public
   */
  router.get("/:id", async (req, res) => {
    try {
      const result = await Model.findOne({ _id: req.params.id });

      if (!result) {
        send("ERROR", 404, "No data found.");
        return;
      }

      send("DATA", 200, sanitize(result));
    } catch (err) {
      send("ERROR", 404, "Data unreachable.");
    }
  });

  /**
   * @route POST /api/<route_name>
   * @desc Add <route_name>
   * @access private
   */
  router.post(
    "/",
    [auth, check["name"], validate],
    async (req: AuthRequest) => {
      const userId = req.userId;
      const foundUser = await User.findById(userId);

      if (!foundUser) {
        send("ERROR", 404, "User id in token is inappropriate.");
        return;
      }

      const { name } = req.body;

      const objectToInsert = new Model({
        creator: userId,
        name
      });

      try {
        const result = await objectToInsert.save();
        send("DATA", 200, sanitize(result));
      } catch (err) {
        send("DATA", 404, "Write error.");
      }
    }
  );

  /**
   * @route PUT /api/<route_name>
   * @desc Update <route_name>
   * @access private
   */
  router.put(
    "/:id",
    [auth, check["name"], validate],
    async (req: AuthRequest) => {
      const update = {
        name: req.body.name,
        creator: req.userId
      };

      try {
        const updatedDocument = await Model.findOneAndUpdate(
          {
            _id: req.params.id
          },
          update,
          {
            new: true,
            upsert: true
          }
        );

        send("DATA", 200, sanitize(updatedDocument));
      } catch (err) {
        send("DATA", 404, "Write error.");
      }
    }
  );

  /**
   * @route DELETE /api/<route_name>
   * @desc Update <route_name>
   * @access private
   */
  router.delete("/:id", auth, async req => {
    const document = await Model.findOneAndRemove({
      _id: req.params.id
    });

    if (!document) {
      send("ERROR", 404, "No data found.");
      return;
    }
    send("DATA", 200, "Sucessfully removed record.");
  });

  return router;
};

export default CRUDRoute;
