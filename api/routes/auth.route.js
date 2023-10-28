import express from "express";
import * as controller from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', controller.signup)
router.post('/signin', controller.signin)
router.post('/google', controller.google)

export default router