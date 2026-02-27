import { Response } from "express";
import { IreqUser } from "../utils/interface";
import response from "../utils/response";
import OrderModel, { orderDAO, OrderStatus, TypeOrder, TypeVoucher } from "../models/order.model";
import TicketModel from "../models/ticket.model";
import { FilterQuery } from "mongoose";
import { getId } from "../utils/id";

const create = async (req: IreqUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const payload = {
      ...req.body,
      createdBy: userId,
    } as TypeOrder;
    await orderDAO.validate(payload);

    const ticket = await TicketModel.findById(payload.ticket);
    if (!ticket) return response.notFound(res, "Ticket not found");
    if (ticket.quantity < payload.quantity) {
      return response.error(res, null, "Ticket quantity is not enough");
    }

    const total: number = +ticket?.price * +payload.quantity;

    Object.assign(payload, {
      ...payload,
      total,
    });

    const result = await OrderModel.create(payload);
    response.success(res, result, "Order created successfully");
  } catch (error) {
    response.error(res, error, "Failed to create order");
  }
};

const findAll = async (req: IreqUser, res: Response) => {
  try {
    const buildQuery = (filters: any) => {
      let query: FilterQuery<TypeOrder> = {};

      if (filters.search) query.$text = { $search: filters.search };

      return query;
    };

    const { limit = 10, page = 1, search } = req.query;

    const query = buildQuery({
      search,
    });

    const result = await OrderModel.find(query)
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const count = await OrderModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        current: +page,
        total: count,
        totalPages: Math.ceil(count / +limit),
      },
      "Orders fetched successfully",
    );
  } catch (error) {
    response.error(res, error, "Failed to find all orders");
  }
};

const findOne = async (req: IreqUser, res: Response) => {
  try {
    const { orderId } = req.params;

    const result = await OrderModel.findOne({
      orderId,
    });

    if (!result) return response.notFound(res, "Order not found");

    response.success(res, result, "Order fetched successfully");
  } catch (error) {
    response.error(res, error, "Failed to find order");
  }
};

const findAllByMember = async (req: IreqUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const buildQuery = (filters: any) => {
      let query: FilterQuery<TypeOrder> = {
        createdBy: userId,
      };
      if (filters.search) query.$text = { $search: filters.search };

      return query;
    };

    const { limit = 10, page = 1, search } = req.query;

    const query = buildQuery({
      search,
    });

    const result = await OrderModel.find(query)
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const count = await OrderModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        current: +page,
        total: count,
        totalPages: Math.ceil(count / +limit),
      },
      "Orders fetched successfully",
    );
  } catch (error) {
    response.error(res, error, "Failed to find all orders");
  }
};

const complete = async (req: IreqUser, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OrderModel.findOne({
      orderId,
      createdBy: userId,
    });

    if (!order) return response.notFound(res, "Order not found");
    if (order.status === OrderStatus.COMPLETED) return response.error(res, null, "Order is already completed");

    const vouchers: TypeVoucher[] = Array.from({ length: order.quantity }, () => {
      return {
        isPrint: false,
        voucherId: getId(),
      } as TypeVoucher;
    });

    const result = await OrderModel.findOneAndUpdate(
      {
        orderId,
        createdBy: userId,
      },
      {
        vouchers,
        status: OrderStatus.COMPLETED,
      },
      { new: true },
    );

    const ticket = await TicketModel.findById(order.ticket);
    if (!ticket) return response.notFound(res, "Ticket not found");

    await TicketModel.updateOne(
      {
        _id: ticket._id,
      },
      {
        quantity: ticket.quantity - order.quantity,
      },
    );

    response.success(res, result, "Order completed successfully");
  } catch (error) {
    response.error(res, error, "Failed to complete order");
  }
};

const pending = async (req: IreqUser, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findOne({
      orderId,
    });

    if (!order) return response.notFound(res, "Order not found");

    if (order.status === OrderStatus.COMPLETED) return response.error(res, null, "Order is already completed");

    if (order.status === OrderStatus.PENDING) return response.error(res, null, "Order is already pending");

    const result = await OrderModel.findOneAndUpdate(
      { orderId },
      {
        status: OrderStatus.PENDING,
      },
      { new: true },
    );

    response.success(res, result, "Order pending successfully");
  } catch (error) {
    response.error(res, error, "Failed to pending order");
  }
};

const cancelled = async (req: IreqUser, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findOne({
      orderId,
    });

    if (!order) return response.notFound(res, "Order not found");

    if (order.status === OrderStatus.COMPLETED) return response.error(res, null, "Order is already completed");

    if (order.status === OrderStatus.CANCELLED) return response.error(res, null, "Order is already cancelled");

    const result = await OrderModel.findOneAndUpdate(
      { orderId },
      {
        status: OrderStatus.CANCELLED,
      },
      { new: true },
    );

    response.success(res, result, "Order cancelled successfully");
  } catch (error) {
    response.error(res, error, "Failed to cancel order");
  }
};
const remove = async (req: IreqUser, res: Response) => {
  try {
    const { orderId } = req.params;

    const result = await OrderModel.findOneAndDelete(
      {
        orderId,
      },
      {
        new: true,
      },
    );

    if (!result) return response.notFound(res, "Order not found");

    response.success(res, result, "Order removed successfully");
  } catch (error) {
    response.error(res, error, "Failed to remove order");
  }
};

export default {
  create,
  findAll,
  findOne,
  findAllByMember,
  complete,
  pending,
  cancelled,
  remove,
};
