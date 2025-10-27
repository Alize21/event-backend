import { name } from "ejs";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "0.0.1",
    title: "event API documentation",
    description: "API documentation for event management web application",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://event-backend-umber.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "username",
        password: "password",
      },
      RegisterRequest: {
        fullName: "your full name",
        username: "your username",
        email: "example@gmail.com",
        password: "Password123",
        confirmPassword: "Password123",
      },
      ActivationRequest: {
        code: "abcd",
      },
      CreateCategoryRequest: {
        name: "Category Name",
        description: "Category Description",
        icon: "https://example.com/icon.png",
      },
      CreateEventRequest: {
        name: "Event - 1 - name",
        banner: "https://example.com/banner.png",
        category: "64b7f8f8f8f8f8f8f8f8f8f",
        description: "This is a sample event description.",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "1234567890",
          coordinates: [0.0, 0.0],
        },
        isOnline: false,
        isFeatured: false,
      },
      RemoveMediaRequest: {
        fileUrl: "https://example.com/media.png",
      },
    },
  },
};

const OutputFile = "./swagger_output.json";
const enpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(OutputFile, enpointsFiles, doc);
