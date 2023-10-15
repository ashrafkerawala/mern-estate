import express from "express";
import * as controller from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', controller.signup)

export default router