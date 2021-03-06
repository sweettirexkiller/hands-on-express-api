const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order.find({})
        .select('product quantity _id')
        .populate('product','name')
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
};

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
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
            res.status(500).json(error)
        });
};

exports.orders_get_one_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product', 'name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found from provided ID'});
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });

};
exports.orders_delete_order =  (req, res, next) => {
    Order.remove({_id: req.params.orderId}).exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                requests: {
                    type: "POST",
                    url: `http://localhost:3000/orders`,
                    body: {productId: 'ID', quantity: "Number"}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};