import { Response } from "express";
import * as Yup from "yup";

type Pagination = {
  totalPages: number;
  current: number;
  total: number;
};

const success = (res: Response, data: any, message: string) => {
  res.status(200).json({
    meta: {
      status: 200,
      message,
    },
    data,
  });
};

const error = (res: Response, error: unknown, message: string) => {
  if (error instanceof Yup.ValidationError) {
    return res.status(400).json({
      meta: {
        status: 400,
        message,
      },
      data: error.errors,
    });
  }
};

const unauthorized = (res: Response, message: string = "unauthorized") => {
  res.status(403).json({
    meta: {
      status: 403,
      message,
    },
    data: null,
  });
};

const pagination = (res: Response, data: any[], pagination: Pagination, message: string) => {
  res.status(200).json({
    meta: {
      status: 200,
      message,
    },
    data,
    pagination,
  });
};

export default { success, error, unauthorized, pagination };
