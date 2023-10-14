import mongoose from "mongoose";

const BookmarksSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }
}, {timestamps: true});

const Bookmarks = mongoose.model("Bookmarks", BookmarksSchema);
export default Bookmarks;