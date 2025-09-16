import { Request, Response } from "express";

export const dummy = (req: Request, res: Response) => {
  res.status(200).json({ message: "Dummy endpoint is working!" });
};
