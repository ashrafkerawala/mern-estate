import express from "express";
import * as controller from "../controllers/user.controller.js";

const router = express.Router();

router.get('/', controller.base)

router.get('/test', controller.test)

export default router