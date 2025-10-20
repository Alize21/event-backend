import { SECRET } from "./env";
import jwt from "jsonwebtoken";
import { IuserToken } from "./interface";

const generateToken = (user: IuserToken): string => {
  const token = jwt.sign(user, SECRET, { expiresIn: "1h" });
  return token;
};

const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IuserToken;
  return user;
};

export { generateToken, getUserData, IuserToken };
