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
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const graphql_1 = __importDefault(require("./graphql"));
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("cors"));
const JWT_1 = require("./services/JWT");
require('dotenv').config();
(0, database_1.default)();
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/UserRoutes');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express_1.default.json());
const gqlFunc = () => __awaiter(void 0, void 0, void 0, function* () {
    app.use("/graphql", (0, express4_1.expressMiddleware)(yield (0, graphql_1.default)(), {
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            const token = req.headers["authorization"];
            //console.log("Header token: ",token)
            try {
                if (Array.isArray(token))
                    return {};
                const user = yield (0, JWT_1.verifyJWT)(token);
                //console.log("Token user: ", user)
                return { user };
            }
            catch (error) {
                return {};
            }
        }),
    }));
    app.get('/', (req, res) => {
        return res.send("Sever is running");
    });
    app.use('/api/v1', authRoutes);
    app.use('/api/v1', userRoutes);
    app.listen(8000, () => {
        console.log("Server is up and running");
    });
});
gqlFunc();
