"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typedefs_1 = require("./typedefs");
const resolvers_1 = require("./resolvers");
const mutation_1 = require("./mutation");
const queries_1 = require("./queries");
exports.User = { typeDefs: typedefs_1.typeDefs, Resolvers: resolvers_1.Resolvers, Mutation: mutation_1.Mutation, Queries: queries_1.Queries };
