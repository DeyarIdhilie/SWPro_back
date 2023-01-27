const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require("mongoose");
const connectDB = require('./db')
const routes = require('./routes/index')
const nodemailer = require('nodemailer');
const User = require("./models/user");
require('dotenv').config();
const app = express();
const router = express.Router();
const cors = require('cors');
app.use(cors());
// app.use(routes)
const Port = process.env.port ||3002;
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

connectDB().then(()=>{
    app.listen(Port,'192.168.1.7',()=>console.
    log("your server is running the port No."+Port));
    })
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      host:'smtp.gmail.com',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });
    transporter.verify((error,sucsess)=>{
           if(error){
            console.log(error);
           }else {
            console.log("Ready for messages");
            console.log(sucsess)
           }
    });
    app.use(express.json());
    const userRoute = require("./routes/user");
    app.use("/user",userRoute);
    const profileRoute = require("./routes/profile");
    app.use("/profile",profileRoute);
    const dateRoute = require("./routes/date");
    app.use("/date",dateRoute);
    const requestRoute = require("./routes/request");
    app.use("/request",requestRoute);
    const contactsRoute = require("./routes/contacts");
    app.use("/contacts",contactsRoute);
    const webRoute = require("./routes/webside");
    app.use("/web",webRoute);
    function generateEmailVerificationToken() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    app.post("/send-verification-email",(req, res) => {
      console.log("sending email")
      const email = req.body.email;
      const token = generateEmailVerificationToken();
      console.log(token);
      // Save the email and token to the database
      User.updateOne({ email: email }, { $set: { emailVerificationToken: token, isVerified:false } }, (err, result) => {
        if(result.n ==0)
         res.json({error:"No such email"})
         else {
          const mailOptions = {
            from: process.env.AUTH_EMAIL, // The email address the email is sent from
            to: email, // The recipient's email address
            subject: 'Verify your email address', // The subject of the email
            html: `<p>Please click this link to verify your email address:</p>
                  <p><a href="http://192.168.1.7:3002/verify-email?token=${token}">Verify my email</a></p>`
          };
          
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.json({error:error})
            } else {
              console.log(`Email sent: ${info.response}`);
              res.json({message:"verification email is sent"})
            }
          });
         }
        if (err) throw err;
      });
     
   });

   app.get("/verify-email",(req, res) => {
    console.log("verify email");
    const token = req.query.token;
    console.log(token);
    // Find the user with the matching token
    User.findOne({ emailVerificationToken: token }, (err, user) => {
      if (err) {
        res.status(500).send({ error: 'Error finding user' });
      } else if (!user) {
        res.status(400).send({ error: 'Invalid token' });
      } else if(user.isVerified) {
         res.status(200).send({ message: 'Email already verified' });
      } else {
         // Mark the email as verified
         user.isVerified = true;
         user.emailVerificationToken = null;
         user.save((err) => {
            if (err) {
               res.status(500).send({ error: 'Error saving user' });
            } else {
               res.status(200).send({ message: 'Email verified successfully' });
            }
         });
      }
    });
  });


  app.post("/is_verified",(req, res) => {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
       res.json({error: err})
      } else if (!user) {
        res.json({error: "User not found"})
      } else {
        if (user.isVerified) {
          res.json({message: "sucess"})
          
        } else {
          res.json({error: "please check your inbox and verify your email"})
        }
      }
    });
  });