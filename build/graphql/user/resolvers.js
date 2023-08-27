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
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const mutation = {
    createUser: (_, { name, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userAlreadyExists = yield User_1.default.findOne({ email });
            if (userAlreadyExists)
                return new Error("User aalready exists");
            const encryptedPassword = yield bcrypt.hash(password, 10);
            const newUser = yield User_1.default.create({
                name, password: encryptedPassword, email
            });
            return newUser;
        }
        catch (err) {
            return new Error("Something went wrong in signup");
        }
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
            //res.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*7})
            // context.setCookies.push({
            //     name: "token",
            //     value: token,
            //     options: {
            //         domain:'DOMAIN_NAME',
            //         httpOnly: true,
            //         maxAge: 36000,
            //         secure: 'none',
            //         path: '/',
            //         sameSite:'None'
            //     }
            // });
            return user;
        }
        catch (err) {
            return err;
        }
    })
};
exports.Resolvers = { mutation, queries };
