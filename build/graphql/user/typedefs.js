"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql

    type UserID {
        value: Int
    }
    
    union UserOrString = UserID | User

    type User {
        _id: String!
        name: String!
        email: String!
        password: String!
        username: String!
        profileImageUrl: String!
        banner: String!
        bio: String
        tweets: [Tweet]
        likes: [String]
        replies: [Tweet]
        followers: [User]
        following: [User]
        followersCount: Int!
        followingCount: Int!
        blue: Boolean!
        createdAt: String!
        updatedAt: String!
        token: String
        tweetCount: Int!
    }

    type Tweet {
        _id:                  String!
        in_reply:             Boolean
        in_reply_to_tweet_id: String
        in_reply_to_user_id:  User
        text:                 String
        files:                [String]
        author_id:            String!
        likes:                [String]
        replies:              [String]
        retweets:             [String]
        quotetweets:          [String]
        hastags:              [String]
        private:              Boolean
        possibly_sensitive:   Boolean
        viewsCount:           Int!
        createdAt:            String!
        updatedAt:            String!
    }

    type TweetCard {
        _id:                  String!
        author_display_name:  String!
        author_username:      String!
        author_profile_image: String!
        text:                 String
        files:                [String]
        is_liked:             Boolean
        like_count:           Int
        is_retweeted:         Boolean!
        retweet_count:        Int
        quotetweet_count:     Int
        reply_count:          Int
        is_sensitive:         Boolean
        in_reply:             Boolean
        in_reply_to_tweet_id: String
        in_reply_to_user_id:  String
        in_reply_to_username: String
        created_at:           String
        updated_at:           String
        views_count:          Int
        is_following:         Boolean
        is_bookmarked:        Boolean
        bookmark_count:       Int
        is_blue:              Boolean
    }

    type Reply {
        _id:                  String!
        body:                 String
        files:                [String]
        author:               User!
        parentTweet:          Reply
        replies:              Tweet
        likes:                [String]
        retweet:              [Tweet]
        createdAt:            String!
        updatedAt:            String!
        viewsCount:           Int!
        likeCount:            Int!
        replyCount:           Int!
        retweetCount:         Int!
        isLiked:              Boolean!
        isRetweeted:          Boolean!
        ogTweet:              Tweet
    }

    type ConversationDetails {
        conversation_id:       String!
        to_user_id:            String!
        to_user_display_name:  String!
        to_user_profile_image: String!
        to_user_blue:          Boolean!
        to_user_username:      String!
        from_user_id:          String!
        latest_message_text:   String
        latest_message_files:  [String]!
        latest_message_date:   String!
    }

    type ChatBody {
        _id:        String!
        sender_id:  String!
        text:       String
        files:      [String]
        created_at: String!
    }

    type Conversation_User_Details {
        conversation_id:       String
        to_user_id:            String
        to_user_display_name:  String
        to_user_profile_image: String
        to_user_blue:          Boolean
        to_user_username:      String
        from_user_id:          String
    },

    type UserExtraDetails {
        bio: String
        followersCount: Int!
        followingCount: Int!
    }
    type latestJoinedUserType {
        latest_user_dispalyname: String
        latest_user_username: String
        latest_user_profile_image: String
        latest_user_blue: String
        latest_blue_user_dispalyname: String
        latest_blue_user_username: String
        latest_blue_user_profile_image: String
        latest_blue_user_blue: String
    }

    type basicUserDetails {
        _id: String!
        name: String!
        username: String!
        profileImageUrl: String!
        blue: Boolean!
    }

    type fullUserDetails {
        id:              String!
        name:            String!
        email:           String!
        username:        String!
        profile_image:   String!
        banner:          String!
        blue:            Boolean!
        bio:             String
        tweet_count:     Int
        reply_count:     Int
        follower_count:  Int
        following_count: Int
        createdAt:       String
    }
`;
