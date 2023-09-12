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
exports.UserResolvers = void 0;
const User_1 = __importDefault(require("../../models/User"));
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const graphql_1 = require("graphql");
require('dotenv').config();
const mutation = {
    createUser: (_, { name, email, password, username }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userAlreadyExists = yield User_1.default.findOne({ email });
            if (userAlreadyExists)
                throw new graphql_1.GraphQLError("USer already exists");
            const usernameAccountExists = yield User_1.default.findOne({ username });
            if (usernameAccountExists)
                throw new graphql_1.GraphQLError("Username alreay taken");
            const encryptedPassword = yield bcrypt.hash(password, 10);
            const newUser = yield User_1.default.create({
                name, password: encryptedPassword, email, username
            });
            return newUser;
        }
        catch (err) {
            return new Error("Something went wrong in signup");
        }
    }),
};
const queries = {
    hello: () => "Hello",
    say: (_, { name }) => `Name is ${name}`,
    fetchUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_1.default.find({});
        console.log(users);
        return users;
    }),
    fetchUserDetailsWithEmail: (_, { email }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user)
                throw new graphql_1.GraphQLError(`User with email: ${email} does not exists`);
            console.log(user);
            const extendedUser = Object.assign(Object.assign({}, user._doc), { followersCount: user.followers.length, followingCount: user.following.length });
            return extendedUser;
        }
        catch (err) {
            throw new graphql_1.GraphQLError("Something went wrong in fetchUserDetailsWithEmail");
        }
    }),
    fetchUserWithEmail: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user)
                return new Error("User does not exist");
            if (!bcrypt.compare(password, user.password))
                return new Error("Password does not match");
            console.log(process.env.JWT_SECRET);
            const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            console.log(process.env.JWT_SECRET);
            user.password = "I love mahiru";
            user.token = token;
            return user;
        }
        catch (err) {
            return err;
        }
    }),
    userLogin: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("userLogin called through graphql");
            const account = yield User_1.default.findOne({ email });
            if (!account)
                throw new Error("User not found");
            if (!bcrypt.compare(password, account.password))
                return new Error("Password do not match");
            const payload = {
                email: account.email,
                id: account._id
            };
            try {
                console.log(process.env.JWT_SECRET);
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "72h" });
                account.token = token;
                return account;
            }
            catch (error) {
                throw new Error("Token generation failed");
            }
        }
        catch (error) {
            console.log(error);
        }
    })
};
exports.UserResolvers = { mutation, queries };
