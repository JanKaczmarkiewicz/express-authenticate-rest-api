declare namespace Express {
  export interface Request {
    userId?: string;
  }
}

import express = require("express");

export declare type AuthRequest = express.Request & Express.Request;
