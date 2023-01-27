const mongoose = require("mongoose");
const User = require("../models/user");
const DateObject = require("../models/date")
const Schema = mongoose.Schema;

const requestSchema = Schema({
   
    request_creator: {
        type: mongoose.Schema.Types.String,
        required: true,
        ref: "User",
      },
      theDate: {
        type: mongoose.Schema.Types.String,
        required: true,
        ref: "DateObject",
      },
    request_creator_username:String,
    image:String,
    name:{
        firstName: {
            type: String,
            
          },
          lastName: {
            type: String,
           
          }
    },
   
    Date_creator: { type: Schema.Types.ObjectId, ref: 'User' },
    Date_creator_username:String,
    
    accepted:{
        type: Boolean,
        default: false,
    },
    is_viewed:{
        type: Boolean,
        default: false,
    },
    is_deleted:{
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  });
  module.exports= mongoose.model("Request",requestSchema);