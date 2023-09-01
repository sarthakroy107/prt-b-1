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
exports.AuthResolver = void 0;
const User_1 = __importDefault(require("../../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const graphql_1 = require("graphql");
const otp = require('otp-generator');
const mutation = {
    authWidhAuthenticatedProvider: (_, { email, name }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(email, name);
        const user = yield User_1.default.findOne({ email });
        const randomPassword = otp.generate(8, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
            specialChars: true,
        });
        const encryptedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
        if (!user) {
            try {
                console.log("Creating user, password: ", encryptedPassword);
                const newUser = yield User_1.default.create({ email, password: encryptedPassword, name });
                return newUser;
            }
            catch (error) {
                throw new graphql_1.GraphQLError("User not registered and user generation failed");
            }
        }
        return user;
    }),
    registerWithAuthentication: (_, { email, name, password }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(email, name, password);
        try {
            const existingUser = yield User_1.default.findOne({ email });
            console.log("hello", existingUser);
            if (existingUser)
                throw new graphql_1.GraphQLError("User already exists");
            const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
            console.log(encryptedPassword);
            const user = yield User_1.default.create({ email, password: encryptedPassword, name });
            return user;
        }
        catch (err) {
            throw new graphql_1.GraphQLError("Something went wrong");
        }
    })
};
const queries = {};
exports.AuthResolver = { mutation, queries };
