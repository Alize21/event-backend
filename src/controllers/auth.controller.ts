import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IreqUser } from "../utils/interface";
import response from "../utils/response";

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
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test("at-least-one-uppercase", "Password must contain at least one uppercase letter", (value) => {
      if (!value) return false;
      const regex = /^(?=.*[A-Z])/;
      return regex.test(value);
    })
    .test("at-least-one-number", "Password must contain at least one number", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords not match"),
});

const register = async (req: Request, res: Response) => {
  /**
   #swagger.tags = ['Auth']
   #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/RegisterRequest"}
    }
   */
  const { fullName, username, email, password, confirmPassword } = req.body as unknown as Tregister;

  try {
    await registerValidateSchema.validate({ fullName, username, email, password, confirmPassword });

    const result = await UserModel.create({
      fullName,
      username,
      email,
      password,
    });

    response.success(res, result, "user registered successfully");
  } catch (error) {
    const err = error as unknown as Error;
    response.error(res, err, "failed registration");
  }
};

const login = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/LoginRequest"}
    }
   */

  const { identifier, password } = req.body as unknown as Tlogin;
  try {
    const userByIdentifier = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
      isActive: true,
    });

    if (!userByIdentifier) {
      return response.unauthorized(res, "user not found");
    }

    const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
    if (!validatePassword) {
      return response.unauthorized(res, "user not found");
    }

    const token = generateToken({ id: userByIdentifier._id, role: userByIdentifier.role });

    response.success(res, token, "login success");
  } catch (error) {
    const err = error as unknown as Error;
    response.error(res, err, "login failed");
  }
};

const me = async (req: IreqUser, res: Response) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.security = [{
     "bearerAuth": [] 
     }]
   */
  try {
    const user = req.user;
    const result = await UserModel.findById(user?.id);

    response.success(res, result, "success get user profile");
  } catch (error) {
    const err = error as unknown as Error;
    response.error(res, err, "failed to get user profile");
  }
};

const activation = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ActivationRequest" }
        }
      }
    }
   */
  try {
    const { code } = req.body as { code: string };

    const user = await UserModel.findOneAndUpdate(
      {
        activationCode: code,
      },
      {
        isActive: true,
      },
      {
        new: true,
      },
    );

    response.success(res, user, "user successfully activated");
  } catch (error) {
    const err = error as unknown as Error;
    response.error(res, err, "user activation failed");
  }
};

export { register, login, me, activation };
