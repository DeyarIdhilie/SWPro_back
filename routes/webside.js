const express = require("express");
// const User = require("../models/user");
// const Profile = require("../models/profile");
const router = express.Router();
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");
var bcrypt = require('bcrypt')
const app = express();
const Admin = require("../models/admins")
  
router.route("").post( async (req, res) => {
    console.log(req.body);
   
    var newadmin = Admin({
        username:req.body.username,
       
        password: req.body.password,
        
       


    });
  
   
    newadmin.save(function (err, newadmin) {
        // console.log("save");
        
        if (err) {
            // res.json({success: false, msg: 'Failed to save'})
            // console.log(err);
            
             if (err.code === 11000 && err.keyValue.hasOwnProperty('username')) {
                
                res.json({success: false, msg: 'username is already in use'})
            }  
            
           
        }
        else {
      
            res.json({success: true, msg: 'Successfully saved'})
        }
    })
   
});

 router.route("/login").post( async (req, res) => {
    console.log(req.body);
    if(req.body.username){
        console.log("username");
        console.log(req.body.username);
        Admin.findOne({
            username: req.body.username
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    console.log("User not found")
                    res.send({success: false, msg: 'Authentication Failed, please enter a correct username'})
                    console.log(res.msg)
                }

                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            let jwtSecretKey = process.env.JWT_SECRET_KEY;
                            let data = {
                                     time: Date(),
                                     userId: user._id,
                                     username: user.username
                                       }
                             let token = jwt.sign(data, jwtSecretKey)
                             let userId= user._id
                            res.json({success: true,
                                      msg: " Welcome",
                                      token: token,
                                      
                                    })
                            // console.log(res.token)
                        }
                        else {
                            return res.send({success: false, msg: 'Authentication failed, wrong password'})
                            // console.log(res.msg)
                        }
                    })
                }
        }
        )
    }
   
  
   
});

module.exports = router;