"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userInteractions_1 = require("../controllers/userInteractions");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.put("/like-tweet", auth_1.auth, userInteractions_1.likedTweets);
module.exports = router;
