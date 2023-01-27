const mongoose = require("mongoose");
const User = require("../models/user");
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
        type:[Number],
        index: "2dsphere"
    }
});
const DateSchema = Schema({
   
    creator: {
        type: mongoose.Schema.Types.String,
        required: true,
        ref: "User",
      },
    creator_username:String,
    creator_birthday: Date,
    creator_gender: String,
    creator_image: String,
    description : String,
    startDate : Date,
    attendence_username:String,
    attendence_image: String,
    endDate:Date,
    location: GeoSchema,
    tags: {type: [String]},
    attendence: { type: Schema.Types.ObjectId, ref: 'User' },
    address: String,
    preferable_gender:String,
    preferable_age_gap: {
        min_age_gap: {
            type: Number,
            default: 0
        },
        max_age_gap: {
            type: Number,
            default: Number.MAX_VALUE
        }
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,  
    },
    is_full:{
        type: Boolean,
        default: false,
    }
  });
  module.exports= mongoose.model("Date",DateSchema);