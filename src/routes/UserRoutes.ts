import express from "express";
import { likeTweets, unlikeTweets } from "../controllers/userInteractions";
import { auth } from "../middleware/auth";

const router = express.Router();

router.put("/like-tweet", auth, likeTweets);
router.put('/unlike-tweet', auth, unlikeTweets);

module.exports = router;