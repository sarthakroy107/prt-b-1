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
    registerWidhAuthenticatedProvider: (_, { email, name, username }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("registerWidhAuthenticatedProvide: ", email, name, username);
        const userWithEmail = yield User_1.default.findOne({ email });
        if (userWithEmail)
            throw new graphql_1.GraphQLError("User with same email already exists");
        const userWithUsername = yield User_1.default.findOne({ username });
        if (userWithUsername)
            throw new graphql_1.GraphQLError("User with same username already exists");
        let encryptedPassword;
        try {
            const randomPassword = otp.generate(8, {
                upperCaseAlphabets: true,
                lowerCaseAlphabets: true,
                specialChars: false,
            });
            console.log(randomPassword);
            encryptedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
        }
        catch (error) {
            throw new graphql_1.GraphQLError("Encrypted password generation failed");
        }
        try {
            console.log("Creating user, password: ", encryptedPassword);
            const newUser = yield User_1.default.create({ email, password: encryptedPassword, name, username });
            return newUser;
        }
        catch (error) {
            throw new graphql_1.GraphQLError("User not registered and user generation failed");
        }
    }),
    registerWithCredentialsAuthentication: (_, { email, name, password, username }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(email, name, password, username);
        try {
            const userWithSameEmail = yield User_1.default.findOne({ email });
            if (userWithSameEmail)
                throw new graphql_1.GraphQLError("User with same EMAIL exists");
            const userWithSameUsername = yield User_1.default.findOne({ username });
            if (userWithSameUsername)
                throw new graphql_1.GraphQLError("User with same USERNAME exists");
            const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
            console.log(encryptedPassword);
            const user = yield User_1.default.create({ email, password: encryptedPassword, name, username });
            return user;
        }
        catch (err) {
            throw new graphql_1.GraphQLError("Something went wrong");
        }
    })
};
const queries = {
    usernameAvailability: (_, { username }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(username);
        try {
            const available = yield User_1.default.findOne({ username });
            if (available)
                return false;
            return true;
        }
        catch (err) {
            throw new graphql_1.GraphQLError("Somethhing went wrong while checking username");
        }
    })
};
exports.AuthResolver = { mutation, queries };
