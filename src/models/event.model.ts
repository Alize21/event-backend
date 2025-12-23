import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const EVENT_MODEL_NAME = "Event";

const schema = mongoose.Schema;

export const eventDAO = Yup.object({
  name: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  description: Yup.string().required(),
  banner: Yup.string().required(),
  isFeatured: Yup.boolean().required(),
  isOnline: Yup.boolean().required(),
  isPublish: Yup.boolean(),
  category: Yup.string().required(),
  slug: Yup.string(),
  createdBy: Yup.string().required(),
  createdAt: Yup.string(),
  updateAt: Yup.string(),
  location: Yup.object()
    .shape({
      region: Yup.number(),
      coordinates: Yup.array(),
      address: Yup.string(),
    })
    .required(),
});

export type TEvent = Yup.InferType<typeof eventDAO>;

export interface Event extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EventSchema = new schema<Event>(
  {
    name: {
      type: schema.Types.String,
      required: true,
    },
    startDate: {
      type: schema.Types.String,
      required: true,
    },
    endDate: {
      type: schema.Types.String,
      required: true,
    },
    description: {
      type: schema.Types.String,
      required: true,
    },
    banner: {
      type: schema.Types.String,
      required: true,
    },
    category: {
      type: schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    isFeatured: {
      type: schema.Types.Boolean,
      required: true,
    },
    isOnline: {
      type: schema.Types.Boolean,
      required: true,
    },
    isPublish: {
      type: schema.Types.Boolean,
      default: false,
    },
    createdBy: {
      type: schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    slug: {
      type: schema.Types.String,
      unique: true,
    },
    location: {
      type: {
        region: {
          type: schema.Types.Number,
        },
        coordinates: {
          type: [schema.Types.Number],
          default: [0, 0],
        },
        address: {
          type: schema.Types.String,
        },
      },
    },
  },
  { timestamps: true }
).index({ name: "text" });

EventSchema.pre("save", function () {
  if (!this.slug) {
    const slug = this.name.split(" ").join("-").toLowerCase();
    this.slug = `${slug}`;
  }
});

const EventModel = mongoose.model(EVENT_MODEL_NAME, EventSchema);
export default EventModel;
