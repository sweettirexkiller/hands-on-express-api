const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request to /orders"
    });
});


router.post("/", (req, res, next) => {
    res.status(201).json({
        message: "Handling POST request to /orders"
    });
});

router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "fetching order",
        id: req.params.orderId
    });
});

router.delete("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "deleted order",
        id: req.params.orderId
    });
});



module.exports = router;