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
    },
  },
};

const OutputFile = "./swagger_output.json";
const enpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(OutputFile, enpointsFiles, doc);
