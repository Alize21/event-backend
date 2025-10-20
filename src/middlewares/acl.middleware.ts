import { Response, NextFunction } from "express";
import { IreqUser } from "../utils/interface";

export default (roles: string[]) => {
  return (req: IreqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        data: null,
        message: "Forbidden",
      });
    }

    next();
  };
};
