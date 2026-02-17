import { Response } from "express";
import { IPaginationQuery, IreqUser } from "../utils/interface";
import response from "../utils/response";
import EventModel, { eventDAO, TypeEvent } from "../models/event.model";
import { FilterQuery, isValidObjectId } from "mongoose";

const create = async (req: IreqUser, res: Response) => {
  try {
    const payload = { ...req.body, createdBy: req.user?.id } as TypeEvent;
    await eventDAO.validate(payload);
    const result = await EventModel.create(payload);

    response.success(res, result, "Event created successfully");
  } catch (error) {
    response.error(res, error, "Failed to create event");
  }
};

const findAll = async (req: IreqUser, res: Response) => {
  try {
    const buildQuery = (filters: any) => {
      let query: FilterQuery<TypeEvent> = {};

      if (filters.search) query.$text = { $search: filters.search };
      if (filters.category) query.category = filters.category;
      if (filters.isOnline) query.isOnline = filters.isOnline;
      if (filters.isPublish) query.isPublish = filters.isPublish;
      if (filters.isFeatured) query.isFeatured = filters.isFeatured;

      return query;
    };

    const { limit = 10, page = 1, search, category, isOnline, isFeatured, isPublish } = req.query;

    const query = buildQuery({
      search,
      category,
      isOnline,
      isFeatured,
      isPublish,
    });

    const result = await EventModel.find(query)
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const count = await EventModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        current: +page,
        total: count,
        totalPages: Math.ceil(count / +limit),
      },
      "Events fetched successfully",
    );
  } catch (error) {
    response.error(res, error, "Failed to find all events");
  }
};

const findOne = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.notFound(res, "Event not found");
    }

    const result = await EventModel.findById(id);

    if (!result) {
      return response.notFound(res, "Banner not found");
    }

    response.success(res, result, "Event fetched successfully");
  } catch (error) {
    response.error(res, error, "Failed to find an event");
  }
};

const update = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.notFound(res, "Event not found");
    }

    const result = await EventModel.findByIdAndUpdate(id, req.body, { new: true });

    response.success(res, result, "Event updated successfully");
  } catch (error) {
    response.error(res, error, "Failed to update an event");
  }
};

const remove = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.notFound(res, "Event not found");
    }

    const result = await EventModel.findByIdAndDelete(id, { new: true });

    response.success(res, result, "Event deleted successfully");
  } catch (error) {
    response.error(res, error, "Failed to remove an event");
  }
};

const findOneBySlug = async (req: IreqUser, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await EventModel.findOne({
      slug,
    });

    response.success(res, result, "Event fetched successfully");
  } catch (error) {
    response.error(res, error, "Failed to find an event by slug");
  }
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
  findOneBySlug,
};
