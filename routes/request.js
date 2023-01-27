const express = require("express");
const User = require("../models/user");
const router = express.Router();
const DateObject = require("../models/date");
const middleware =require("../middleware");
const Request = require("../models/request");
const app = express();
router.patch("/decline",middleware.checkToken,async(req, res, next)=>{

    try{
        console.log(req.body.requestId)
        Request.findOneAndUpdate({ _id: req.body.requestId }, { $set: { is_viewed: true } }, function (err, request) {
            if (err) res.send({success:false, error:err});
            else res.send({success:true})
          });
        
    } catch (error) {
        next(error)
      }  
 });
 router.patch("/accept",middleware.checkToken,async(req, res, next)=>{

    try{
        console.log("accept")
        console.log(req.body.dateId)
        DateObject.findById(req.body.dateId, (err, doc) => {
            if (err) {
                return res.send({success:false,error:err});
            }
            if (doc.is_full === true) {
                return res.send({ success:false,error: "date is full" });
            }
            else{
                doc.is_full = true;
                doc.attendence = req.body.requestCreatorId;
                doc.save((error) => {
                    if (error) {
                            return res.send({success:false,error:error});
                      }
                    else {
                        Request.findOneAndUpdate({ _id: req.body.requestId }, { $set: { is_viewed: true,accepted:true } }, function (err, request) {
                            if (err) res.send({success:false, error:err});
                            else {
                                Request.updateMany({ theDate: req.body.dateId, accepted: false }, { $set: { is_viewed: true } }, (err, doc) => {
                                    if (err) {
                                        return res.send({success:false, "error":err});
                                    }
                                   
                                    else{
                                        if (!doc) {
                                            console.log( "No request found" );
                                        }
                                        User.findByIdAndUpdate(req.userId, { $push: { contacts: req.body.requestCreatorId } }, { new: true }, (err, doc) => {
                                            if (err) {
                                                return res.status(500).send(err);
                                            }
                                            if (!doc) {
                                                console.log( "No request found" );
                                            }
                                            return res.send({success:true});
                                        });
                                        
                                    }
                                    // return res.send({success:true});
                                });
                                
                                
                            }
                          });
                    }
               });
            }
            // return res.send(doc);
        });
        
    } catch (error) {
        next(error)
      }  
 });
router.get("",middleware.checkToken,async(req, res, next)=>{

    try{
        console.log("get requests")
        console.log(req.userId)
        Request.find({ Date_creator:  req.userId}).sort({ createdAt: -1 }).exec((err, requests) => {
            if (err) {
                res.send({success:false,error:err})
            } else {
                res.send(requests)
            }
        });
        
    } catch (error) {
        next(error)
      }  
 });
router.post("",middleware.checkToken,async(req, res, next)=>{

    try{
      console.log(req.userId)
      console.log(req.username)
      console.log(req.body)
      var request = Request({
        request_creator:req.userId,
        request_creator_username:req.username,
        theDate: req.body.theDate,
        image: req.body.image,
        name:{
            firstName:req.body.name["firstName"],
            lastName:req.body.name["lastName"]
        },
        Date_creator: req.body.Date_creator,
        Date_creator_username: req.body.Date_creator_username


    });
    // newUser.validate(function(error) {
    //     console.log(error);
    //   });
   
    request.save(function (err, newUser) {
        // console.log("save");
        
        if (err) {
            res.json({success: false})
            
        }
        else {
       
            res.json({success: true})
        }
    })
   
     
    } catch (error) {
        next(error)
      }  
 });

module.exports = router;