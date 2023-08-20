const mongoose = require("mongoose");
// require("dotenv").config();

const connect = () => {
    mongoose.connect("mongodb+srv://ag2558:amiya1234567890@cluster0.goggn0v.mongodb.net/twitterclone", {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB connected"))
    .catch((err: any )=>{
        console.log("Error occured while connectiong to DB");
        console.log(`Error: ${err}`);
    })
}

export default connect;