import express from "express";
import router from "./routes/api";
import db from "./utils/database";

const app = express();
const PORT = process.env.PORT || 3000;

async function init() {
  try {
    const result = await db();

    console.log(`database status: ${result}`);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
