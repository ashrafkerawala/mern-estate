import express from 'express';
import * as controller from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, controller.createListing)
router.delete('/delete/:id', verifyToken, controller.deleteListing)

export default router;