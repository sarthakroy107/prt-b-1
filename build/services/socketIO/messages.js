"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.checkConversation = void 0;
const DirectMessages_1 = __importDefault(require("../../models/DirectMessages"));
const Message_1 = __importDefault(require("../../models/Message"));
const checkConversation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newConversation = yield DirectMessages_1.default.findOne({ members: { $all: [data.senderId, data.to_user_id] } });
        if (!newConversation) {
            const newConversation = yield DirectMessages_1.default.create({ members: [data.senderId, data.to_user_id] });
            return newConversation._id.toString();
        }
        console.log(newConversation);
        return newConversation === null || newConversation === void 0 ? void 0 : newConversation._id.toString();
    }
    catch (error) {
        //console.log(error)
        throw new Error("Something went wrong in cheackConversation");
    }
});
exports.checkConversation = checkConversation;
const createMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.conversationId === null) {
        data.conversationId = yield (0, exports.checkConversation)(data);
    }
    //console.log(data)
    const newMessage = yield Message_1.default.create({ conversationId: data.conversationId, sender: data.senderId, text: data.text, files: data.files === undefined ? [] : data.files });
    const createdAtString = newMessage.createdAt.toISOString();
    const formatedMessage = {
        _id: newMessage._id,
        sender_id: newMessage.sender,
        text: newMessage.text === undefined ? null : newMessage.text,
        files: newMessage.files === undefined || newMessage === null ? [] : newMessage.files,
        created_at: Date.parse(createdAtString).toString(),
    };
    return formatedMessage;
});
exports.createMessage = createMessage;
