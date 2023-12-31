"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../controllers/Auth");
const router = express_1.default.Router();
router.post('/login', Auth_1.userLogin);
router.put('/username-availibility', Auth_1.checkUsernameavailability);
router.put("/user-details", Auth_1.userDetails);
module.exports = router;
