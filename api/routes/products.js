const express = require('express');
const router  = express.Router();

router.get("/", (req,res,next)=>{
    res.status(200).json({
        message: "Handling GET reuest to /products"
    });
});


router.post("/", (req,res,next)=>{
    res.status(200).json({
        message: "Handling POST reuest to /products"
    });
});


module.exports = router;