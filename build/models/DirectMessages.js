"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DirectMessageSchema = new mongoose_1.default.Schema({
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }]
}, { timestamps: true });
const DirectMessage = mongoose_1.default.model("DirectMessage", DirectMessageSchema);
exports.default = DirectMessage;
