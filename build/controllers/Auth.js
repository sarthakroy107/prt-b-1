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
exports.userLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        console.log("userLogin called");
        const account = yield User_1.default.findOne({ email });
        if (!account)
            throw new Error("User not found");
        if (!bcrypt_1.default.compare(password, account.password))
            return new Error("Password do not match");
        const payload = {
            email: account.email,
            id: account._id
        };
        try {
            console.log(process.env.JWT_SECRET);
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "72h" });
            account.token = token;
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options);
            return res.status(200).json({
                success: true,
                message: "Token send, check"
            });
        }
        catch (error) {
            throw new Error("Token generation failed");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.userLogin = userLogin;
