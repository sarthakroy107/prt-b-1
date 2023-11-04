const mongoose = require("mongoose");

require("dotenv").config()
//console.log(process.env.DATABASE_URL)
const connect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
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