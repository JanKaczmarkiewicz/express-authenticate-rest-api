import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

import { send } from "../utils/responce";
import { AuthRequest } from "../types";
import env from "../config/env";

export const auth: RequestHandler = (req: AuthRequest, res, next) => {
  const bearerToken = req.headers.authorization;

  if (bearerToken) {
    try {
      const authToken = bearerToken.split(" ")[1];
      const data: any = jwt.verify(authToken, env("PASSWORD_SECRET"));
      req.userId = data.id;
    } catch (err) {
      send(
        "ERROR",
        401,
        "Your authorization is incorrect or your access expired! Please login again!"
      );
      return;
    }
  } else {
    send("ERROR", 401, "Please login first!");
    return;
  }
  next();
};
