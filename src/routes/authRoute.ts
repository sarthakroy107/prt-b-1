import express from "express";
import { userLogin, checkUsernameavailability, userDetails } from '../controllers/Auth';
const router = express.Router();

router.post('/login', userLogin)
router.put('/username-availibility', checkUsernameavailability);
router.put("/user-details", userDetails)

module.exports = router;