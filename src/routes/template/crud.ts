import { Router, Request } from "express";

import { auth } from "../../middleware/auth";
import { validate, check } from "../../middleware/validate";

import { send } from "../../utils/responce";
import { AuthRequest } from "../../types";
import User from "../../Models/User";
import { Model } from "mongoose";

const extractFromBody = (props: string[], body: Request["body"]) =>
  props.reduce(
    (prev, curr) => (body[curr] ? { ...prev, [curr]: body[curr] } : prev),
    {}
  );

export type Methods = {
  [key: string]: (router: Router) => void;
};
export interface Sanitizer {
  (document: any): any;
}

const endpointTemplate = (
  Model: Model<any>,
  sanitize: Sanitizer,
  props: string[]
): Methods => {
  const checkAdd = props.map(prop => check[prop]);
  const checkUpdate = props.map(prop => check[prop].optional());

  const methods: Methods = {
    /**
     * @route GET /api/<route_name>
     * @desc Get all <route_name>
     * @returns all <route_name>s
     * @access public
     */
    getAll: router => {
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
      return methods;
    },
    /**
     * @route GET /api/<route_name>
     * @desc Get single <route_name>
     * @returns <route_name> with specefied id
     * @access public
     */
    getOne: router =>
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
      }),

    /**
     * @route DELETE /api/<route_name>
     * @desc Update <route_name>
     * @access private
     */
    remove: router =>
      router.delete("/:id", auth, async req => {
        const document = await Model.findOneAndRemove({
          _id: req.params.id
        });

        if (!document) {
          send("ERROR", 404, "No data found.");
          return;
        }
        send("DATA", 200, "Sucessfully removed record.");
      }),
    /**
     * @route POST /api/<route_name>
     * @desc Add <route_name>
     * @access private
     */
    add: router =>
      router.post(
        "/",
        [auth, ...checkAdd, validate],
        async (req: AuthRequest) => {
          const userId = req.userId;

          const foundUser = await User.findById(userId);

          if (!foundUser) {
            send("ERROR", 404, "User id in token is inappropriate.");
            return;
          }

          const dataToInsert = extractFromBody(props, req.body);
          console.log(dataToInsert);

          const objectToInsert = new Model({
            creator: userId,
            ...dataToInsert
          });

          try {
            const result = await objectToInsert.save();
            send("DATA", 200, sanitize(result));
          } catch (err) {
            console.error("add", err);
            send("DATA", 404, "Write error.");
          }
        }
      ),

    /**
     * @route PUT /api/<route_name>
     * @desc Update <route_name>
     * @access private
     */
    update: router =>
      router.put(
        "/:id",
        [auth, ...checkUpdate, validate],
        async (req: AuthRequest) => {
          const data = extractFromBody(props, req.body);
          const update = {
            ...data,
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
            console.error("update", err);
            send("DATA", 404, "Write error.");
          }
        }
      )
  };

  return methods;
};

export default endpointTemplate;
