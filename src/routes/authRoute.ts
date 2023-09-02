import express from "express";
import { userLogin, checkUsernameavailability } from '../controllers/Auth';
const router = express.Router();

router.post('/login', userLogin)
router.put('/username-availibility', checkUsernameavailability);

module.exports = router;