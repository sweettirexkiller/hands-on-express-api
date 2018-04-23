const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');

router.get("/", (req, res, next) => {
    Order.find({})
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quality,
                        requests: {
                            type: 'GET',
                            url: `http://localhost:3000/orders/${doc._id}`
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});


router.post("/", (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });

    order.save()
        .then(result =>{
            res.status(201).json({
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    requests: {
                        type: 'GET',
                        url: `http://localhost:3000/orders/${result._id}`
                    }
                }
            })
        })
        .catch(error => {
            res.status(500).json({error})
        });
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .exec()
        .then(doc=>{
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({message: 'No valid entry found from provided ID'});
            }
        })
        .catch(error=>{
            res.status(500).json({error});
        });

});

router.delete("/:orderId", (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result =>{
            res.staus(200).json(result);
        })
        .catch(error=>{
            res.status(500).json({error});
        });
});


module.exports = router;