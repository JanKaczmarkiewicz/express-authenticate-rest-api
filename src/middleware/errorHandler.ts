import { ErrorRequestHandler } from "express";
import { send } from "../utils/responce";

export default ((err, req, res, next) => {
  switch (err.type) {
    case "entity.parse.failed":
      send("ERROR", 404, "Sended data is invalid!");
      return;
  }

  next();
}) as ErrorRequestHandler;
