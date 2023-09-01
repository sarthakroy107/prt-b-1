import express from "express";
import { userLogin } from '../controllers/Auth';
const router = express.Router();

router.post('/login', userLogin)

module.exports = router;