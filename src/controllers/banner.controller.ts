import { Response } from "express";
import { IPaginationQuery, IreqUser } from "../utils/interface";
import response from "../utils/response";
import BannerModel, { bannerDAO, TypeBanner } from "../models/banner.model";
import { FilterQuery } from "mongoose";

const create = async (req: IreqUser, res: Response) => {
  try {
    await bannerDAO.validate(req.body);

    const result = await BannerModel.create(req.body);
    response.success(res, result, "Banner created successfully");
  } catch (error) {
    response.error(res, error, "Failed to create banner");
  }
};

const findAll = async (req: IreqUser, res: Response) => {
  try {
    const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery;

    const query: FilterQuery<TypeBanner> = {};

    if (search) {
      Object.assign(query, {
        ...query,
        $text: {
          $search: search,
        },
      });
    }

    const result = await BannerModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await BannerModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        total: count,
        current: page,
        totalPages: Math.ceil(count / limit),
      },
      "Banners Fetched Successfully"
    );
  } catch (error) {
    response.error(res, error, "Failed to find all banners");
  }
};

const findOne = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    const result = await BannerModel.findById(id);
    response.success(res, result, "Banner Fetched Successfully");
  } catch (error) {
    response.error(res, error, "Failed to find one banner");
  }
};

const update = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    const result = await BannerModel.findByIdAndUpdate(id, req.body, { new: true });
    response.success(res, result, "Banner Updated Successfully");
  } catch (error) {
    response.error(res, error, "Failed to update banner");
  }
};

const remove = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    const result = await BannerModel.findByIdAndDelete(id, { new: true });
    response.success(res, result, "Banner Deleted Successfully");
  } catch (error) {
    response.error(res, error, "Failed to remove banner");
  }
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
};
