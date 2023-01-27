const express = require("express");
const User = require("../models/user");
const router = express.Router();
const DateObject = require("../models/date");
const middleware =require("../middleware");
const moment = require('moment');
const app = express();
const cosine = require("cosine-similarity");
router.post("",middleware.checkToken,async(req, res, next)=>{

    try{
        console.log(req.userId)
        console.log(req.body)
        console.log(req.username)
        var newDate = DateObject({
            creator: req.userId,
            creator_username: req.body.creator_username,
            creator_birthday:req.body.creator_birthday,
            creator_gender: req.body.creator_gender,
            creator_image: req.body.creator_image,
            preferable_gender: req.body.preferable_gender,
            preferable_age_gap:{
                min_age_gap:req.body.preferable_age_gap["min_age_gap"],
                max_age_gap:req.body.preferable_age_gap["max_age_gap"]
            },
            location: req.body.location,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            tags: req.body.tags,
    
        });
        newDate.save();
        //push created event to virtual myEvents field in the user scheme
        User.findById(req.userId)
           .populate('myDates')
           .exec((error, user) => {
            if (error) {
              console.log(error);
           } else {
           console.log(newDate);  
           user.myDates.push(newDate);
           user.save((error) => {
           if (error) {
              console.log(error);
             } else {
              console.log("success");
            }
    });
  }
});
        res.status(201).json("success");
        
   
     
    } catch (error) {
        next(error)
      }  
 });

 router.get("",middleware.checkToken,(req,res)=>{ 
    console.log(req.query)
    var timeNow = new Date();  
    var query
    if(req.query.tag){
        query=   {
            startDate: { $gt: timeNow },
            creator: { $ne: req.userId },  // exclude documents with matching _id
            distance: { $lt: parseFloat(req.query.raduis) },  // only
            creator_username: { $ne: req.username },
            creator_birthday: { $exists: true, $ne: null },
            is_full : {$ne:true}
            ,$or: [
                { 
                    $and: [
                        { preferable_gender: { $ne: "" } },
                        { preferable_gender: { $eq: req.query.gender } }
                    ]
                },
                { preferable_gender: { $eq: "" } }
            ],
            
            tags:  req.query.tag
            
            
    }
    }
    else {
        query=   {
            startDate: { $gt: timeNow },
            creator: { $ne: req.userId },  // exclude documents with matching _id
            distance: { $lt: parseFloat(req.query.raduis) },  // only
            creator_username: { $ne: req.username },
            creator_birthday: { $exists: true, $ne: null },
            is_full : {$ne:true}
            ,$or: [
                { 
                    $and: [
                        { preferable_gender: { $ne: "" } },
                        { preferable_gender: { $eq: req.query.gender } }
                    ]
                },
                { preferable_gender: { $eq: "" } }
            ]
            
            
            
            
    }
    }
    

    const birthday = moment(req.query.birthday, "YYYY-MM-DDTHH:mm:ss.sssZ");
    console.log(timeNow);
       
       DateObject.aggregate([
        
        {
            $geoNear: {
                    near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
                        }
                    },
                        distanceField: "distance",
                        $maxDistance: parseFloat(req.query.raduis),
                        hint: { coordinates: "2dsphere" },
                        spherical: true
                        }
        },
        {
            $addFields: {
                ageGap :  Math.abs((moment("$creator_birthday", "YYYY-MM-DDTHH:mm:ss.sssZ").toDate())-(birthday.toDate()))/31536000000
               
            }
        },          
         
        {
            $addFields: {
                similarity : null
               
            }
        },
        
        {
            $match: query
         }
  
        
    ]).exec().then(function(result) {
       
        // console.log(result)
        result.forEach(function(dateObject) {
            var userLat = parseFloat(req.query.userlat);
            // console.log(userLat);
            var userLng = parseFloat(req.query.userlng);
            // console.log(userLng);
            var locationLat = parseFloat(dateObject.location.coordinates[1]);
            // console.log(locationLat);
            var locationLng = parseFloat(dateObject.location.coordinates[0]);
            var creator_birthday = dateObject.creator_birthday;
            // console.log(locationLng);
            var ageGap =  Math.abs((moment(creator_birthday, "YYYY-MM-DDTHH:mm:ss.sssZ").toDate())-(birthday.toDate()))/31536000000
            // console.log(ageGap)
            var min_age_gap = dateObject.preferable_age_gap.min_age_gap
            var max_age_gap = dateObject.preferable_age_gap.max_age_gap
            
            var R = 6371e3; // Earth's radius in meters
            var φ1 = userLat * Math.PI / 180; // Convert degrees to radians
            var φ2 = locationLat * Math.PI / 180;
            var Δφ = (locationLat-userLat) * Math.PI / 180;
            var Δλ = (locationLng-userLng) * Math.PI / 180;
            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var distance = R * c;
            dateObject.distance = distance;
            dateObject.ageGap = ageGap;
            if(ageGap>=min_age_gap && ageGap<=max_age_gap)
            console.log(true);
            
        });
        for(let i = 0; i < result.length; i++) {
            if (!(result[i].ageGap>=result[i].preferable_age_gap.min_age_gap && result[i].ageGap<=result[i].preferable_age_gap.max_age_gap)) {
                result.splice(i, 1);
                i--;
            }
        }
        let users=[]
        var vector1 
        var vector2 
        
        let similarity
        async function updateSimilarity() {
            for (const dateObject of result) {
                try {
                    const user1 = await User.findById(dateObject.creator);
                    const vector2 = user1.vector;
                    console.log(vector2)
                    const user2 = await User.findById(req.userId);
                    const vector1 = user2.vector;
                    console.log(vector1)
                    const similarity = cosine(vector1, vector2);
                    dateObject.similarity = Math.round(similarity*100);
                } catch (err) {
                    console.log(err);
                }
            }
            // You can now use the updated result here
            console.log(result);
           res.send(result);
        }
        
        updateSimilarity();
    });
    
});

 module.exports = router;