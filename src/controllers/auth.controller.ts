import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel, { userDTO, userLoginDTO, userUpdatePasswordDTO } from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IreqUser } from "../utils/interface";
import response from "../utils/response";

const updateProfile = async (req: IreqUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const { fullName, profilePicture } = req.body;

    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        profilePicture,
      },
      {
        new: true,
      },
    );

    if (!result) return response.notFound(res, "user not found");

    response.success(res, result, "user profile updated successfully");
  } catch (error) {
    response.error(res, error, "failed to update user profile");
  }
};

const updatePassword = async (req: IreqUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, password, confirmPassword } = req.body;

    await userUpdatePasswordDTO.validate({
      oldPassword,
      password,
      confirmPassword,
    });

    const user = await UserModel.findById(userId);

    if (!user || user.password !== encrypt(oldPassword)) return response.notFound(res, "user not found");

    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: encrypt(password),
      },
      {
        new: true,
      },
    );

    response.success(res, result, "user password updated successfully");
  } catch (error) {
    response.error(res, error, "failed to update user password");
  }
};

const register = async (req: Request, res: Response) => {
  const { fullName, username, email, password, confirmPassword } = req.body;

  try {
    await userDTO.validate({ fullName, username, email, password, confirmPassword });

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
  try {
    const { identifier, password } = req.body;
    await userLoginDTO.validate({ identifier, password });

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

export { register, login, me, activation, updateProfile, updatePassword };
