import express from "express";
import { dummy } from "../controllers/dummy.controller";

const router = express.Router();

router.get("/dummy", dummy);

export default router;
