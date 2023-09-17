import mongoose from "mongoose";

export interface tweetTypeDef {

  save():               unknown;
  _id:                  mongoose.Schema.Types.ObjectId
  in_reply:             boolean;
  in_reply_to_tweet_id: mongoose.Schema.Types.ObjectId | string | null;
  in_reply_to_user_id:  mongoose.Schema.Types.ObjectId | string | null;
  text:                 string | undefined;
  files:                string[] | [];
  author_id:            mongoose.Schema.Types.ObjectId;
  likes:                (mongoose.Schema.Types.ObjectId | string)[];
  replies:              (mongoose.Schema.Types.ObjectId | string)[];
  retweets:             (mongoose.Schema.Types.ObjectId | string)[];
  quotetweets:          (mongoose.Schema.Types.ObjectId | string)[];
  hashtags:             (mongoose.Schema.Types.ObjectId | string)[];
  private:              boolean;
  possibly_sensitive:   boolean;
  viewsCount:           number;
  createdAt:            Date | string;
  updatedAt:            Date | string;
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

export interface responeTypeDef {
  _id:                   mongoose.Types.ObjectId | string;
  author_display_name:  string;
  author_username:      string;
  author_profile_image: string;
  text:                 string | null;
  files:                string[] | null;
  is_liked:             boolean;
  like_count:           number;
  is_retweeted:         boolean;
  retweet_count:        number;
  quotetweet_count:     number;
  reply_count:          number;
  is_sensitive:         boolean;
  in_reply:             boolean;
  in_reply_to_tweet_id: mongoose.Types.ObjectId | string | null;
  in_reply_to_user_id:  mongoose.Types.ObjectId | string | null;
  in_reply_to_username: string;
  created_at:           Date | string;
  updated_at:           Date | string;

}