import express from "express";
import * as controller from "../controllers/user.controller.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', controller.base)
router.get('/test', controller.test)
router.post('/update/:id', verifyToken, controller.updateUser)
router.delete('/delete/:id', verifyToken, controller.deleteUser)
router.get('/listings/:id', verifyToken, controller.getUserListings)

export default router