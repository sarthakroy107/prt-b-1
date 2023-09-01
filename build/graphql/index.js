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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const user_1 = require("./user");
const client_1 = require("@prisma/client");
const auth_1 = require("./auth");
const prisma = new client_1.PrismaClient();
function createApolloGraphqlServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const gqlServer = new server_1.ApolloServer({
            typeDefs: `#graphql
        ${user_1.User.typeDefs}
        type Query {
            ${user_1.User.Queries}
            ${auth_1.Auth.Queries}
        }
        type Mutation {
            ${user_1.User.Mutation}
            ${auth_1.Auth.Mutation}
        }
        `,
            resolvers: {
                Query: Object.assign(Object.assign({}, user_1.User.UserResolvers.queries), auth_1.Auth.AuthResolver.queries),
                Mutation: Object.assign(Object.assign({}, user_1.User.UserResolvers.mutation), auth_1.Auth.AuthResolver.mutation)
            },
        });
        yield gqlServer.start();
        return gqlServer;
    });
}
exports.default = createApolloGraphqlServer;
