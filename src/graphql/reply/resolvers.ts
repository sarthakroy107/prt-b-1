import mongoose, { Mongoose } from "mongoose";

import Tweet from "../../models/Tweet";
import User from "../../models/User"
import { GraphQLError } from 'graphql';
const mutation = {
    createReply: async(_:any, { tweetId, body, files }: {tweetId: string, body: string | undefined, files: string[] | undefined}, context: any) => {
        
    }
}

const queries = {

}


export const ReplyResolver = { mutation, queries };