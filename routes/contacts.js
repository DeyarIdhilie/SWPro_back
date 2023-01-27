const express = require("express");
const User = require("../models/user");

const router = express.Router();

const middleware =require("../middleware");

const app = express();
router.get("",middleware.checkToken,(req,res)=>{ 
    User.findById(req.userId)
    .populate({
        path: 'contacts', 
        select: 'profile.image name.firstName name.lastName',
    })
    .exec((err, user) => {
        if (err) return res.status(400).json({ error: 'User not found' });
        if (!user) return res.status(400).json({ error: 'User not found' });
        res.json(user.contacts);
    });

   
});

module.exports = router;