// const express = require('express')
// const app = express();
// const router = express.Router()

// app.use(express.json());
// const userRoute = require("./user");
// app.use("/user",userRoute);

// module.exports = router
const express = require('express');

const app = express();


app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})


app.use(express.json());
const userRoute = require("./user");
app.use("/user",userRoute);

