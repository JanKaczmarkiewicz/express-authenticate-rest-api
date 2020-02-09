import endpointTemplate, { Sanitizer } from "./template/crud";
import House, { IHouse } from "../Models/House";
import express from "express";

type SanitizedObject = {
  id: string;
  number: IHouse["number"];
  creator: IHouse["creator"];
  createdAt: IHouse["createdAt"];
};

const sanitize: Sanitizer = ({
  _id,
  number,
  creator,
  createdAt
}: IHouse): SanitizedObject => ({
  id: _id,
  number,
  createdAt,
  creator
});

const router = express.Router();
const { add, getAll, getOne, update, remove } = endpointTemplate(
  House,
  sanitize,
  ["number"]
);
[add, getAll, getOne, update, remove].forEach(attach => attach(router));

export default router;
