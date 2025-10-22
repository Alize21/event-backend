import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

export interface IuserToken extends Omit<User, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "username"> {
  id?: Types.ObjectId;
}
export interface IreqUser extends Request {
  user?: IuserToken;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}
