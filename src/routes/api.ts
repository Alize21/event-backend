import express from "express";
import { register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/auth/register", register);

export default router;
