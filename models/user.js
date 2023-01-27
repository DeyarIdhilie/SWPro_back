var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')


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
const interestSchema = new Schema(
    {
        Technology: Number, 
        Science: Number, 
        Sports: Number, 
        Beauty: Number,  
        Fashion: Number, 
        Cultures: Number, 
        Music: Number, 
        Kpop: Number,
        Tiktok: Number,
        Instagram: Number,
        Photography: Number,
        Languages: Number,
        Religions: Number,
        Reading: Number,
        Cooking: Number,
        Food: Number,
        Video_Games: Number,
        Traveling: Number,
        Board_Games: Number,
        Movie_Watching: Number,
        Painting: Number,
        Politics: Number,
        Animal_care: Number,
        feminisim: Number,
        Human_rights_movments: Number,
        Mental_Health: Number,

    }
);
var userSchema = new Schema({
    is_admin:{
        type : Boolean,
        default: 0
    },
    is_active:{
        type : Boolean,
        default: 0
    },
    is_banned:{
        type : Boolean,
        default: 0  
    },
    name:{
        firstName: {
            type: String,
            required: true
          },
          lastName: {
            type: String,
            required: true
          }
    },
    username: {
        type: String,
        require: true,
        unique:true
        
    },
    email: {
        type: String,
        require: true,
        unique:true
    },
    phone: {
            type: String,
            require: true,
            unique:true
    },
    password: {
        type: String,
        require: true
    },
    Gender: { 
        type: String,
        
        required:true
},
    birthday: {  
        type: Date,
        require: true
    },
    location: GeoSchema,
   
    profile: profileSchema,
    interests:{type: [String]},
    emailVerificationToken: {
        type: String,
        default: null,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      interestTable: interestSchema,
      vector: [Number],
})
userSchema.virtual("myDates", {
    ref: 'Date',
    localField: "_id",
    foreignField: "creator",
  });

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
    
})
// userSchema.pre('validate', User , function(next) {
//     var user= this;
//     userSchema.find({ email: this.email }, function(error, users) {
//       if (error) {
//         next(error);
//       } else if (users.length > 0) {
//         next(new Error('Email already exists'));
//       } else {
//         next();
//       }
//     });
//   });
userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)
