import { User } from "../models/user.model";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface IuserToken extends Omit<User, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "username"> {
  id?: Types.ObjectId;
}

const generateToken = (user: IuserToken): string => {
  const token = jwt.sign(user, process.env.SECRET!, { expiresIn: "1h" });
  return token;
};

const getUserData = (token: string) => {
  const user = jwt.verify(token, process.env.SECRET!) as IuserToken;
  return user;
};

export { generateToken, getUserData, IuserToken };
