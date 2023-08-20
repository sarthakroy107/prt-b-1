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
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const gqlFunc = () => __awaiter(void 0, void 0, void 0, function* () {
    const gqlServer = new server_1.ApolloServer({
        typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
        type Mutation {
            createUser(name: String!, email: String!, password: String!): Boolean
        }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello",
                say: (_, { name }) => `Namw is ${name}`
            },
            Mutation: {
                createUser: (_, { name, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
                    yield prisma.user.create({
                        data: {
                            name, password, email
                        }
                    });
                    return true;
                })
            }
        },
    });
    yield gqlServer.start();
    app.use('/graphql', (0, express4_1.expressMiddleware)(gqlServer));
    app.get('/', (req, res) => {
        return res.send("Sever is running");
    });
    app.listen(8000, () => {
        console.log("Server is up and running");
    });
});
gqlFunc();
