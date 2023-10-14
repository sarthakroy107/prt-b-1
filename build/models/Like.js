"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LikesSchema = new mongoose_1.default.Schema({
    tweet_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tweet",
        required: true
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
const Likes = mongoose_1.default.model("Likes", LikesSchema);
exports.default = Likes;
