import { Response } from "express";
import { IPaginationQuery, IreqUser } from "../utils/interface";
import response from "../utils/response";
import TicketModel, { ticketDAO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

const create = async (req: IreqUser, res: Response) => {
  try {
    await ticketDAO.validate(req.body);
    const result = await TicketModel.create(req.body);
    response.success(res, result, "Ticket Created Successfully");
  } catch (error) {
    response.error(res, error, "Ticket Creation Failed");
  }
};

const findAll = async (req: IreqUser, res: Response) => {
  try {
    const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery;

    const query: FilterQuery<TypeTicket> = {};

    if (search) {
      Object.assign(query, {
        ...query,
        $text: {
          $search: search,
        },
      });
    }

    const result = await TicketModel.find(query)
      .populate("events")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await TicketModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        total: count,
        current: page,
        totalPages: Math.ceil(count / limit),
      },
      "Tickets Fetched Successfully"
    );
  } catch (error) {
    response.error(res, error, "Fetching Tickets Failed");
  }
};
const findOne = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.notFound(res, "Ticket not found");
    }

    const result = await TicketModel.findById(id);

    if (!result) {
      return response.notFound(res, "Ticket not found");
    }

    response.success(res, result, "Ticket Fetched Successfully");
  } catch (error) {
    response.error(res, error, "Fetching Ticket Failed");
  }
};

const update = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.notFound(res, "Ticket not found");
    }

    const result = await TicketModel.findByIdAndUpdate(id, req.body, { new: true });
    response.success(res, result, "Ticket Fetched Successfully");
  } catch (error) {
    response.error(res, error, "Updating Ticket Failed");
  }
};

const remove = async (req: IreqUser, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.notFound(res, "Ticket not found");
    }

    const result = await TicketModel.findByIdAndDelete(id, { new: true });
    response.success(res, result, "Ticket Deleted Successfully");
  } catch (error) {
    response.error(res, error, "Deleting Ticket Failed");
  }
};

const findAllByEvent = async (req: IreqUser, res: Response) => {
  try {
    const { eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return response.notFound(res, "Event not found");
    }

    const result = await TicketModel.find({ events: eventId }).exec();
    response.success(res, result, "Tickets by Event Fetched Successfully");
  } catch (error) {
    response.error(res, error, "Fetching Tickets by Event Failed");
  }
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
  findAllByEvent,
};
