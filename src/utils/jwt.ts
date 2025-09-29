import { User } from "../models/user.model";
import { Types } from "mongoose";
import { SECRET } from "./env";
import jwt from "jsonwebtoken";

interface IuserToken extends Omit<User, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "username"> {
  id?: Types.ObjectId;
}

const generateToken = (user: IuserToken): string => {
  const token = jwt.sign(user, SECRET, { expiresIn: "1h" });
  return token;
};

const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IuserToken;
  return user;
};

export { generateToken, getUserData, IuserToken };
