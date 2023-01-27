const jwt = require("jsonwebtoken");
const config = require("./config");
const dotenv = require('dotenv');
dotenv.config();

const checkToken =(req,res,next)=>{
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
   
    try {
        // const token = req.header(tokenHeaderKey);
        let token  = req.headers["authorization"];
         console.log(token);
        token= token.slice(7,token.length);
        if(token)
        {
        
          const verified = jwt.verify(token, jwtSecretKey,function(err, decodedToken){
            if(err) { console.log(err) }
            else {
             req.userId = decodedToken.userId;   // Add to req object
             req.username =  decodedToken.username;
             console.log( decodedToken.userId);
             console.log( decodedToken.username);
             next();
            }
          } );
  
       }
       else{
        return res.status(401);
        // .json({
        //     status:false,
        //     msg:"Token is not provided"
        // })
    }
    } catch (error) {
        // Access Denied
        return res.status(401);//.send(error);
    }
    
};
module.exports ={
    checkToken:checkToken, 
}; 