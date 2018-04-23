const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request to /orders"
    });
});


router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling POST request to /orders"
    });
});



module.exports = router;