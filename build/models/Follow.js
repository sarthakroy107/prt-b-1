"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FollowSchema = new mongoose_1.default.Schema({
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }]
}, { timestamps: true });
const Follows = mongoose_1.default.model("Follows", FollowSchema);
exports.default = Follows;
