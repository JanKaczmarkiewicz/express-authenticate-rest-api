import endpointTemplate from "./template/crud";
import express from "express";
import Street, { IStreet } from "../Models/Street";
// import { validate } from "../middleware/validate";
// import { AuthRequest } from "../types";
// import { check } from "../middleware/validate";
// import { auth } from "../middleware/auth";
// import { send } from "../utils/responce";

type SanitizedObject = {
  id: string;
  name: IStreet["name"];
  creator: IStreet["creator"];
  createdAt: IStreet["createdAt"];
};

const sanitize = ({
  _id,
  name,
  creator,
  createdAt
}: IStreet): SanitizedObject => ({
  id: _id,
  name,
  createdAt,
  creator
});

const router = express.Router();

const { getAll, getOne, update, remove, add } = endpointTemplate(
  Street,
  sanitize,
  ["name"]
);

[getAll, getOne, update, remove, add].forEach(attach => attach(router));

export default router;
