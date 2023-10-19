import express from "express";
import { bluewebhook, likeTweets, payment, unlikeTweets } from "../controllers/userInteractions";
import { auth } from "../middleware/auth";

const router = express.Router();

router.put("/like-tweet", auth, likeTweets);
router.put('/unlike-tweet', auth, unlikeTweets);
router.post('/payment', payment)

module.exports = router;