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

export type userType = {
  id:                   mongoose.Schema.Types.ObjectId | string
  name:                 string
  email:                string
  username:             string
  profile_image:        string
  banner:               string
  blue:                 boolean
  bio:                  string | null
  tweet_count:          number | null
  reply_count:          number | null
  follower_count:       number | null
  following_count:      number | null
  createdAt:            Date | string
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
  text:                 string   | null;
  files:                string[]
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
  views_count:          number;
  is_following?:        boolean;
  is_bookmarked?:       boolean;
  bookmark_count?:      number;
  is_blue:              boolean;
}

export interface conversationTypeDef {
  conversation_id:      mongoose.Types.ObjectId | string;
  to_user_id:           mongoose.Types.ObjectId | string;
  to_user_display_name: string;
  to_user_profile_image:string;
  to_user_blue:         boolean;
  to_user_username:     string;
  from_user_id:         mongoose.Types.ObjectId | string;
  latest_message_text:  string | null;
  latest_message_files: string[] | null;
  latest_message_date:  Date | string;
}

export interface chatObjectTypeDef {
  _id:                   mongoose.Types.ObjectId | string;
  sender_id:             mongoose.Types.ObjectId | string;
  text:                  string | null;
  files:                 string[] | null;
  created_at:            Date | string;
}
export interface chat_sender_TypeDef {
  conversation_id:       mongoose.Types.ObjectId | string | null; //don't touch this
  to_user_id:            mongoose.Types.ObjectId | string;
  to_user_display_name:  string;
  to_user_profile_image: string;
  to_user_blue:          boolean;
  to_user_username:      string;
  from_user_id:          mongoose.Types.ObjectId | string;
}

export type message_data_type = {
  text:           string   | null;
  files:          string[] | null;
  conversationId: string   | null;
  senderId:       string;
  to_user_id:     string;
}