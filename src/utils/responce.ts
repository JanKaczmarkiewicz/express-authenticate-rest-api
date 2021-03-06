import { Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
let responceApi: Response | null = null;

const setupResponce: RequestHandler = (req, res, next) => {
  responceApi = res;
  next();
};

type ResponseType = "ERROR" | "WARNING" | "DATA";

const send = (type: ResponseType, status: number, message: any) => {
  if (!responceApi) {
    throw new Error("Can't send back data!");
  }
  responceApi.status(status);
  switch (type) {
    case "ERROR":
      return responceApi.send({ error: message });

    case "WARNING":
      return responceApi.send({ warning: message });

    case "DATA":
      return responceApi.send({ data: message });
  }
};

export const createToken = (id: string): string =>
  jwt.sign({ id }, env("PASSWORD_SECRET"), {
    expiresIn: "1h"
  });
export { send };
export default setupResponce;
