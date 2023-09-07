"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const queries_1 = require("./queries");
const mutation_1 = require("./mutation");
const resolvers_1 = require("./resolvers");
exports.Tweet = { Queries: queries_1.Queries, Mutation: mutation_1.Mutation, TweetResolver: resolvers_1.TweetResolver };
