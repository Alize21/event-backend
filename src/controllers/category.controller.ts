import { Response } from "express";
import { IPaginationQuery, IreqUser } from "../utils/interface";
import CategoryModel, { categoryDAO } from "../models/category.model";
import response from "../utils/response";

const create = async (req: IreqUser, res: Response) => {
  try {
    await categoryDAO.validate(req.body);
    const result = await CategoryModel.create(req.body);
    response.success(res, result, "category created successfully");
  } catch (error) {
    response.error(res, error, "failed to create category");
  }
};

const findOne = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryModel.findById(id);

    response.success(res, result, "successfully found one category");
  } catch (error) {
    response.error(res, error, "failed to find one category");
  }
};

const findAll = async (req: IreqUser, res: Response) => {
  const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;
  try {
    const query = {};

    if (search) {
      Object.assign(query, {
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            description: { $regex: search, $options: "i" },
          },
        ],
      });
    }

    const result = await CategoryModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await CategoryModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        total: count,
        totalPages: Math.ceil(count / limit),
        current: page,
      },
      "successfully found all categories"
    );
  } catch (error) {
    response.error(res, error, "failed to find all categories");
  }
};

const update = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });

    response.success(res, result, "category updated successfully");
  } catch (error) {
    response.error(res, error, "failed to update category");
  }
};

const remove = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryModel.findByIdAndDelete(id);

    response.success(res, result, "category removed successfully");
  } catch (error) {
    response.error(res, error, "failed to remove category");
  }
};

export default {
  create,
  findOne,
  findAll,
  update,
  remove,
};
