const mongoose = require("mongoose");
// const express = require('express');
require('dotenv').config();
// const app = express();
// const Port = process.env.port ||3002;
const connectDB = async() => {
    try {
const connection = await mongoose.connection;
connection.once("open",()=>{
    console.log("mongoDb connected");
})
mongoose.connect(process.env.Mongo_URI,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,}
        )
       

.catch((error)=>{
    console.log("Can't connect to mongodb atlas,the error is :"+error)
})
connection.once("open",()=>{console.log("Everything's gonna be alright")})
// connection.once('open', function() {
//     const collection = connection.collection('users');
//     collection.getIndexes(function(error, indexes) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(indexes);
//       }
//     });
//   });
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB