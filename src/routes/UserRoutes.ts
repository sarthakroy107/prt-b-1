import express from "express";
import { likedTweets } from "../controllers/userInteractions";
import { auth } from "../middleware/auth";

const router = express.Router();

router.put("/like-tweet", auth, likedTweets)

module.exports = router;