const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get("/", (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc=>{
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        requests: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({err});
        });

});


router.post("/", (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .then(result => {
            res.status(201).json({
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    requests: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });

});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key]
    }
    Product.update({_id: id}, {$set: updateOps}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({error})
        });

});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({error})
        });
});


module.exports = router;