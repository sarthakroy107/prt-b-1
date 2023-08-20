import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689175938/umimcqeipkpowe4k3i5k.jpg"
    },
    bio:{
        type: String,
        maxLength: 100
    },
    tweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }],
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }],
    blue:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema);