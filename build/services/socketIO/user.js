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
exports.autoCompleteUser = void 0;
const User_1 = __importDefault(require("../../models/User"));
const autoCompleteUser = (searchString) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        console.log(searchString.searchString);
        const users = yield User_1.default.aggregate([
            {
                $search: {
                    index: "default",
                    text: {
                        // @ts-ignore
                        query: searchString.searchString,
                        path: ["username", "name"],
                        fuzzy: {
                            maxEdits: 2,
                            maxExpansions: 100
                        },
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "followedUsers"
                }
            },
            {
                $addFields: {
                    isFollowedByYou: {
                        $in: ["$_id", "$followedUsers._id"]
                    }
                }
            },
            {
                $sort: {
                    isFollowedByYou: -1, // Sort in descending order so that followed users come first
                    // Add other sorting criteria here if needed
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    name: 1,
                    blue: 1,
                    profileImageUrl: 1
                }
            }
        ]);
        return users;
    }
    catch (error) {
        console.log(error);
        throw new Error("Something went wrong in autoCompleteUser");
    }
});
exports.autoCompleteUser = autoCompleteUser;
