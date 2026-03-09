import { Request, Response, NextFunction } from "express";
import response from "../utils/response";

const serverRoute = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    response.notFound(res, "route not found");
  };
};

const serverError = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    response.error(res, err, err.message);
  };
};

export default {
  serverRoute,
  serverError,
};
