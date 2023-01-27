const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
// const Profile = require("../models/profile");
const router = express.Router();
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");
const uploadImage = require('../helpers/helpers')
const bodyParser = require('body-parser')
const multer = require('multer')
const app = express();
var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAwxVL81WZGrsYiSFmtOCGSCsRXoc4_fk4', // for Mapquest, OpenCage, Google Premier
    formatter: 'json' // 'gpx', 'string', ...
  };
  const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5mb.
      fileSize: 5 * 1024 * 1024,
    },
  })
  
  app.disable('x-powered-by')
  app.use(multerMid.single('file'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))
  

router.post("",middleware.checkToken,async(req, res, next)=>{

    try{
        console.log(req.body)
        let user = req.body.optionsMap
        console.log(user)
        let values = [];
          
          for (let key in user) {
              values.push(user[key]);
          }
          console.log(values)
        var url
       
       if (req.file){
        const myFile = req.file
       
        url = await uploadImage(myFile, req.userId)
        console.log(url)
       }
       else {
        url = 'https://storage.googleapis.com/laqeene-bucket/default'
        console.log(url)
       }
       const imageUrl=url
        User.findOneAndUpdate(
           
            {_id: req.userId},
            {$set: 
                {
                profile: 
                {
                image:imageUrl,
                bio: req.body.bio,
                city:{
                    name: req.body.city["thename"],
                    privacy: req.body.city["privacy"]
                    
                  },
                  school:{
                    name: req.body.school["thename"],
                    privacy: req.body.school["privacy"]
                  },
                  university:{
                    name: req.body.university["thename"],
                    privacy: req.body.university["privacy"]
                  },
                  job:{
                    position: req.body.job["position"],
                    privacy: req.body.job["privacy"]
                  }
               
            },
            interests: req.body.interests,
            interestTable:{
        Technology: values[0], 
        Science: values[1], 
        Sports: values[2], 
        Beauty: values[3],  
        Fashion: values[4], 
        Cultures: values[5], 
        Music: values[6], 
        Kpop: values[7],
        Tiktok: values[8],
        Instagram: values[9],
        Photography: values[10],
        Languages: values[11],
        Religions: values[12],
        Reading: values[13],
        Cooking: values[14],
        Food: values[15],
        Video_Games: values[16],
        Traveling: values[17],
        Board_Games: values[18],
        Movie_Watching: values[19],
        Painting: values[20],
        Politics: values[21],
        Animal_care: values[22],
        feminisim: values[23],
        Human_rights_movments: values[24],
        Mental_Health: values[25],
            },
            vector:values
        }
    }).then((user,err) => {
                    
                  
                
                if(err){
                     console.log(err);
                    // 
                    res.status(500).json({success: false, msg: 'User not found'})
                }
                 else if (user)
               
                 res.status(201).json({success: true, msg: imageUrl})
         });
        
   
     
    } catch (error) {
        next(error)
      }  
 });
 router.put("",middleware.checkToken,async(req, res, next)=>{

  try{
      console.log(req.body)
      console.log(req.userId)
      let userss = req.body.optionsMap
      console.log(userss)
      let values = [];
        
        for (let key in userss) {
            values.push(userss[key]);
        }
        console.log(values)
      var url
     
     if (req.file){
      const myFile = req.file
     
      url = await uploadImage(myFile, req.userId)
      console.log(url)
      const imageUrl=url
      User.findOneAndUpdate(
          {_id: req.userId},
          {$set: 
              {
              profile: 
              {
              image:imageUrl,
              bio: req.body.bio,
              city:{
                  name: req.body.city["thename"],
                  privacy: req.body.city["privacy"]
                  
                },
                school:{
                  name: req.body.school["thename"],
                  privacy: req.body.school["privacy"]
                },
                university:{
                  name: req.body.university["thename"],
                  privacy: req.body.university["privacy"]
                },
                job:{
                  position: req.body.job["position"],
                  privacy: req.body.job["privacy"]
                }
             
          },
          interests: req.body.interests,
          interestTable:{
            Technology: values[0], 
            Science: values[1], 
            Sports: values[2], 
            Beauty: values[3],  
            Fashion: values[4], 
            Cultures: values[5], 
            Music: values[6], 
            Kpop: values[7],
            Tiktok: values[8],
            Instagram: values[9],
            Photography: values[10],
            Languages: values[11],
            Religions: values[12],
            Reading: values[13],
            Cooking: values[14],
            Food: values[15],
            Video_Games: values[16],
            Traveling: values[17],
            Board_Games: values[18],
            Movie_Watching: values[19],
            Painting: values[20],
            Politics: values[21],
            Animal_care: values[22],
            feminisim: values[23],
            Human_rights_movments: values[24],
            Mental_Health: values[25],
                },
            vector:values
      }
  }).then((user,err) => {
                  
                
              
              if(err){
                   console.log(err);
                  // 
                  res.status(500).json({success: false, msg: 'User not found'})
              }
               else if (user)
              
              res.status(201).json({success: true, msg: imageUrl})
       });
      
     }
     else{
      let userr = {};
      await User.findOne({ _id: req.userId }, (err, result) => {
        if (err) {
          userr = {};
        }
        if (result != null) {
          userr = result;
        }
      });
     
      User.findOneAndUpdate(
          {_id: req.userId},
          {$set: 
              {
              profile: 
              {
              image:userr.profile.image,
              bio: req.body.bio,
              city:{
                  name: req.body.city["thename"],
                  privacy: req.body.city["privacy"]
                  
                },
                school:{
                  name: req.body.school["thename"],
                  privacy: req.body.school["privacy"]
                },
                university:{
                  name: req.body.university["thename"],
                  privacy: req.body.university["privacy"]
                },
                job:{
                  position: req.body.job["position"],
                  privacy: req.body.job["privacy"]
                }
             
          },
          interests: req.body.interests,
          interestTable:{
            Technology: values[0], 
            Science: values[1], 
            Sports: values[2], 
            Beauty: values[3],  
            Fashion: values[4], 
            Cultures: values[5], 
            Music: values[6], 
            Kpop: values[7],
            Tiktok: values[8],
            Instagram: values[9],
            Photography: values[10],
            Languages: values[11],
            Religions: values[12],
            Reading: values[13],
            Cooking: values[14],
            Food: values[15],
            Video_Games: values[16],
            Traveling: values[17],
            Board_Games: values[18],
            Movie_Watching: values[19],
            Painting: values[20],
            Politics: values[21],
            Animal_care: values[22],
            feminisim: values[23],
            Human_rights_movments: values[24],
            Mental_Health: values[25],
                },
            vector:values
      }
  }).then((user,err) => {
                  
                
              
              if(err){
                   console.log(err);
                  // 
                  res.status(500).json({success: false, msg: 'User not found'})
              }
               else if (user)
              
              res.status(201).json({success: true})
       });
      
     }
     
     
 
 
   
  } catch (error) {
      next(error)
    }  
});

router.get("",middleware.checkToken,async(req, res, next)=>{

  try{
    console.log(req.query.id)
    const user = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
      { $project: {
          firstname:'$name.firstName',
          lastname:'$name.lastName',
          image: '$profile.image',
          bio: '$profile.bio',
          city: { $cond: [{ $eq: ['$profile.city.privacy', true] }, '', '$profile.city.name'] },
          university: { $cond: [{ $eq: ['$profile.university.privacy', true] }, '', '$profile.university.name'] },
          school:{ $cond: [{ $eq: ['$profile.school.privacy', true] }, '', '$profile.school.name'] },
          job: { $cond: [{ $eq: ['$profile.job.privacy', true] }, '', '$profile.job.position'] },
          interests:'$interests',
      } }
  ]);
  //   const user = await User.aggregate([
  //     { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
  //     { $project: {
  //         'profile.city.name': { $cond: [{ $eq: ['$profile.city.privacy', true] }, '', '$profile.city.name'] },
  //         'profile.school.name': { $cond: [{ $eq: ['$profile.school.privacy', true] }, '', '$profile.school.name'] },
  //         'profile.university.name': { $cond: [{ $eq: ['$profile.university.privacy', true] }, '', '$profile.university.name'] },
  //         'profile.job.position': { $cond: [{ $eq: ['$profile.job.privacy', true] }, '', '$profile.job.position'] },
  //         'profile.city.privacy': 1,
  //         'profile.school.privacy': 1,
  //         'profile.university.privacy': 1,
  //         'profile.job.privacy': 1
  //     } }
  // ]);
   res.send(user[0])
  // return user[0].profile;
      
 
   
  } catch (error) {
      next(error)
    }  
});

 app.use((err, req, res, next) => {
    res.status(500).json({
      error: err,
      message: 'Internal server error!',
    })
    next()
  });

module.exports = router;