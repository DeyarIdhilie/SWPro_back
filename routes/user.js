const express = require("express");
const User = require("../models/user");
// const Profile = require("../models/profile");
const router = express.Router();
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");
var bcrypt = require('bcrypt')
const app = express();

  
router.route("").post( async (req, res) => {
    console.log(req.body);
    // console.log(req.body.name);
    // console.log(req.body.name["lastName"]);
    var newUser = User({
        username:req.body.username,
        email: req.body.email,
        phone:req.body.phone,
        password: req.body.password,
        birthday: req.body.birthday,
        Gender: req.body.Gender,
        name:{
            firstName:req.body.name["Firstname"],
            lastName:req.body.name["lastName"]
        }


    });
    // newUser.validate(function(error) {
    //     console.log(error);
    //   });
   
    newUser.save(function (err, newUser) {
        // console.log("save");
        
        if (err) {
            // res.json({success: false, msg: 'Failed to save'})
            // console.log(err);
            if (err.code === 11000 && err.keyValue.hasOwnProperty('email')) {
               
                res.json({success: false, msg: 'email is already in use'})
            }  
            else if (err.code === 11000 && err.keyValue.hasOwnProperty('username')) {
                
                res.json({success: false, msg: 'username is already in use'})
            }  
            else if (err.code === 11000 && err.keyValue.hasOwnProperty('phone')) {
               
                res.json({success: false, msg: 'phone is already in use'})
            }  
           
        }
        else {
       // res.status(403).send({success: false, msg: 'Successfully saved'})
              let jwtSecretKey = process.env.JWT_SECRET_KEY;
               let data = {
              time: Date(),
           userId: newUser._id,
           username: newUser.username
       }
     
       let token = jwt.sign(data, jwtSecretKey);
      
       
            console.log(newUser._id)
            res.json({success: true, msg: 'Successfully saved',token:token,userId:newUser._id})
        }
    })
   
});
router.route("").patch( async (req, res) => {
    let password;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            cocnsole.log(err)
        }
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
                console.log(err)
                return res.status(500).json({error:err});
            }
            password = hash;
            User.findOneAndUpdate(
                {email: req.body.email},
                {$set: {password: password}},
                (err,result) => {
                    if (!result){
                        console.log("no user with that email");
                        return res.status(404).json({error:"No user with this email"});
                       
                    }
                    if(err) return res.status(500).json({error:err});
                    // console.log("added location");
                    else {
                        
                        return res.status(200).json({message:"password changed"});
                    }
                }
            );
            
        })
    })
    // console.log(password)
    

});
router.patch("/location",middleware.checkToken,(req, res)=>{
    console.log(req.body);
     User.findOneAndUpdate(
         {_id: req.userId},
         {$set: {location: req.body.location}},
         (err,result) => {
             if (!result){
                console.log("no user with that id");
             }
             if(err) return res.status(500).json({msg:err});
             console.log("added location");
             
             return res.status(200).json("location");
         }
     );
     
     
 });
 router.route("/login").post( async (req, res) => {
    console.log(req.body);
    if(req.body.username){
        console.log("username");
        console.log(req.body.username);
        User.findOne({
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
                                      userId: userId,
                                      image:user.profile.image,
                                      username:user.username,
                                      firstName:user.name.firstName,
                                      lastName:user.name.lastName,
                                      gender:user.Gender,
                                      birthday:user.birthday,
                                      tags: user.interests,
                                      bio:user.profile.bio,
                                      city:user.profile.city.name,
                                      city_privacy:user.profile.city.privacy,
                                      school: user.profile.school.name,
                                      school_privacy:user.profile.school.privacy,
                                      uni: user.profile.university.name,
                                      uni_privacy:user.profile.university.privacy,
                                      job: user.profile.job.position,
                                      job_privacy:user.profile.job.privacy
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
    if(req.body.phone){
        console.log("phone");
        console.log(req.body.phone);
        User.findOne({
            phone: req.body.phone
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    console.log("User not found")
                    res.send({success: false, msg: 'Authentication Failed, please enter a correct phonenumber'})
                    // console.log(res.msg)
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
                             let  userId= user._id
                             let token = jwt.sign(data, jwtSecretKey);
                             res.json({success: true,
                                msg: " Welcome",
                                token: token,
                                userId: userId,
                                image:user.profile.image,
                                username:user.username,
                                firstName:user.name.firstName,
                                lastName:user.name.lastName,
                                gender:user.Gender,
                                birthday:user.birthday,
                                tags: user.interests,
                                bio:user.profile.bio,
                                city:user.profile.city.name,
                                city_privacy:user.profile.city.privacy,
                                school: user.profile.school.name,
                                school_privacy:user.profile.school.privacy,
                                uni: user.profile.university.name,
                                uni_privacy:user.profile.university.privacy,
                                job: user.profile.job.position,
                                job_privacy:user.profile.job.privacy
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