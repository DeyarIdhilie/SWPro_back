var mongoose = require('mongoose')
var Schema = mongoose.Schema;



const profileSchema = new Schema(
    {
        image:{
        type:String,
        default:""
      },
      bio: {
        type:String,
        default:""
      },
      city:{
        name:{
            type:String,
            default:""
        },
        privacy: {
            type:Boolean,
            default:0,
        },
        
      },
      
      school:{
        name:{
            type:String,
            default:""
        },
        privacy: {
            type:Boolean,
            default:0,
        },
        
      },
      university:{
        name:{
            type:String,
            default:""
        },
        privacy: {
            type:Boolean,
            default:0,
        },
        
      },
      job:{
        position:{
            type:String,
            default:""
        },
        privacy: {
            type:Boolean,
            default:0,
        },
        
     
      }

    }
);

module.exports = mongoose.model('Profile',  profileSchema)