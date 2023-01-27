var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')


var adminSchema = new Schema({
    is_admin:{
        type : Boolean,
        default: 1
    },
    is_manager:{
        type : Boolean,
        default: 0
    },
    
    username: {
        type: String,
        require: true,
        unique:true
        
    },
    
    password: {
        type: String,
        require: true
    },
   
    emailVerificationToken: {
        type: String,
        default: null,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
     
})


adminSchema.pre('save', function (next) {
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

adminSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('Admin', adminSchema)
