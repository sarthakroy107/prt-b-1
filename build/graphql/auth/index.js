"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const queries_1 = require("./queries");
const mutation_1 = require("./mutation");
const resolvers_1 = require("./resolvers");
exports.Auth = { Queries: queries_1.Queries, Mutation: mutation_1.Mutation, AuthResolver: resolvers_1.AuthResolver };
