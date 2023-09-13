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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const tweetSchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        enum: ['tweet', 'retweet', 'reply'],
        required: true
    },
    body: {
        type: String,
    },
    files: [{
            type: String,
        }],
    author: {
        required: true,
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    replies: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Reply"
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    retweet: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    parentTweet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tweet',
        default: null
    },
    viewsCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
tweetSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("IN POST MIDDLEWARE");
        try {
            const user = yield User_1.default.findById(this.author);
            console.log("User: ", user);
            if (user && !user.tweets.includes(this._id)) {
                user.tweetCount += 1;
                user.tweets.push(this._id);
                yield user.save();
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
tweetSchema.pre('deleteOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("IN POST MIDDLEWARE, deleteOne");
        try {
            const tweetId = yield this.getFilter()._id;
            const tweet = yield Tweet.findById(tweetId).populate('author');
            if (tweet && tweet.author) {
                const user = tweet.author;
                //@ts-ignore
                user.tweets.pull(tweet._id);
                //@ts-ignore
                user.tweetCount -= 1;
                //@ts-ignore
                yield user.save();
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
const Tweet = mongoose_1.default.model("Tweet", tweetSchema);
exports.default = Tweet;
