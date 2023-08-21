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
exports.Resolvers = void 0;
const User_1 = __importDefault(require("../../models/User"));
const mutation = {
    createUser: (_, { name, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(name, email, password);
        let newUser = yield User_1.default.create({
            name, password, email
        });
        console.log(newUser);
        // newUser._id = null
        // newUser.password = undefined
        return newUser;
    })
};
const queries = {
    hello: () => "Hello",
    say: (_, { name }) => `Name is ${name}`,
    fetchUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_1.default.find({});
        console.log(users);
        return users;
    }),
    fetchUserWithId: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(id);
        try {
            const user = yield User_1.default.findById(id);
            return user;
        }
        catch (err) {
            return err;
        }
    })
};
exports.Resolvers = { mutation, queries };
