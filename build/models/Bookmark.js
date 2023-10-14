"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookmarksSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tweet"
    }
}, { timestamps: true });
const Bookmarks = mongoose_1.default.model("Bookmarks", BookmarksSchema);
exports.default = Bookmarks;
