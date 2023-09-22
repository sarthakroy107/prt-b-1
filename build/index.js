"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const http = __importStar(require("http"));
const JWT_1 = require("./services/JWT");
const socket_io_1 = require("socket.io");
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
            try {
                if (Array.isArray(token))
                    return {};
                const user = yield (0, JWT_1.verifyJWT)(token);
                return { user };
            }
            catch (error) {
                return {};
            }
        }),
    }));
    const server = http.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });
    app.get('/', (req, res) => {
        return res.send("Sever is running");
    });
    io.on('connection', (socket) => {
        console.log("Socket connected");
        socket.on('disconnect', () => {
            console.log("Socket disconnected");
        });
    });
    app.use('/api/v1', authRoutes);
    app.use('/api/v1', userRoutes);
    server.listen(8000, () => {
        console.log("Server is up and running");
    });
});
gqlFunc();
