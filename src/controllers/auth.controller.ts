import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";

type Tregister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Tlogin = {
  identifier: string;
  password: string;
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

const register = async (req: Request, res: Response) => {
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

const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body as unknown as Tlogin;

    const userByIdentifier = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!userByIdentifier) {
      return res.status(403).json({
        message: "user not found",
        data: null,
      });
    }

    const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
    if (!validatePassword) {
      return res.status(403).json({
        message: "user not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "login success",
      data: userByIdentifier,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};

export { register, login };
