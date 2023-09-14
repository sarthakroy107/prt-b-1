import mongoose from "mongoose";

export interface tweetTypeDef {
  save(): unknown;
  _id: mongoose.Schema.Types.ObjectId
  category: string;
  body: string | undefined;
  files: string[] | [];
  author: mongoose.Schema.Types.ObjectId;
  replies: mongoose.Schema.Types.ObjectId[];
  likes: (mongoose.Schema.Types.ObjectId | string)[];
  retweet: (mongoose.Schema.Types.ObjectId | string)[];
  quotetweet: (mongoose.Schema.Types.ObjectId | string)[];
  viewsCount: number;
  visibilty: string;
  tags: (mongoose.Schema.Types.ObjectId | string)[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface userTypeDef {
  _id: mongoose.Schema.Types.ObjectId | string
  name: string
  email: string
  password: string
  username: string
  profileImageUrl: string
  banner: string
  bio: string
  tweets: (mongoose.Schema.Types.ObjectId | string)[]
  likes: (mongoose.Schema.Types.ObjectId | string)[]
  replies: (mongoose.Schema.Types.ObjectId | string)[]
  blue: boolean
  followers: (mongoose.Schema.Types.ObjectId | string)[]
  following: (mongoose.Schema.Types.ObjectId | string)[]
  token: string
  tweetCount: number
  createdAt: Date | string
  updatedAt: Date | string

}

export interface replyTypeDef {
  _id: mongoose.Schema.Types.ObjectId;
  category: string
  body: string | undefined;
  files: string[] | [];
  author: mongoose.Schema.Types.ObjectId | string;
  visibility: string;
  replies: mongoose.Schema.Types.ObjectId[];
  likes: (mongoose.Schema.Types.ObjectId | string)[];
  retweet: (mongoose.Schema.Types.ObjectId | string)[];
  quotetweet: (mongoose.Schema.Types.ObjectId | string)[];
  parentTweet: mongoose.Schema.Types.ObjectId | string;
  ogTweet: mongoose.Schema.Types.ObjectId | string;
  viewsCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}