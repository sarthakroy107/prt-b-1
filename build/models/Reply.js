"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const replySchema = new mongoose_1.default.Schema({
    body: {
        type: String,
        requied: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    retweet: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }]
});
