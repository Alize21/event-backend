import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";

type Tregister = {
  fullName: "string";
  username: "string";
  email: "string";
  password: "string";
  confirmPassword: "string";
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords not match"),
});

export const register = async (req: Request, res: Response) => {
  const { fullName, username, email, password, confirmPassword } = req.body as unknown as Tregister;

  try {
    await registerValidateSchema.validate({ fullName, username, email, password, confirmPassword });

    const result = await UserModel.create({
      fullName,
      username,
      email,
      password,
    });

    res.status(200).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};
