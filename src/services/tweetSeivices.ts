import { responeTypeDef } from "../config/typeConfig"

export const format_tweet_to_respose_format = (tweet: any):responeTypeDef  => {
    //console.log(tweet)
    const response_obj: responeTypeDef = {
        _id:                   tweet._id,
        author_display_name:  tweet.author_display_name,
        author_username:      tweet.author_username,
        author_profile_image: tweet.author_profile_image,
        text:                 tweet.text,
        files:                tweet.files,
        is_liked:             tweet.isLiked,
        like_count:           tweet.likeCount,
        is_retweeted:         tweet.isRetweeted,
        retweet_count:        tweet.retweetCount,
        quotetweet_count:     tweet.quotetweetCount,
        reply_count:          tweet.replyCount,
        is_sensitive:         tweet.possibly_sensitive,
        in_reply:             tweet.in_reply,
        in_reply_to_user_id:  tweet.in_reply_to_user_id,
        in_reply_to_tweet_id: tweet.in_reply_to_tweet_id === undefined ||  null ? null : tweet.in_reply_to_tweet_id,
        in_reply_to_username: tweet.in_reply_to_username === undefined ||  null ? null : tweet.in_reply_to_username, 
        created_at:           tweet.createdAt,
        updated_at:           tweet.updatedAt
    }
    //console.log(response_obj)
    return response_obj
}