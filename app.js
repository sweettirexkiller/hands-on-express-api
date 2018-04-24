const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');




app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect(`mongodb://node-shop:${process.env.MONGO_ATLAS_PW}@node-shop-shard-00-00-gpxsx.mongodb.net:27017,node-shop-shard-00-01-gpxsx.mongodb.net:27017,node-shop-shard-00-02-gpxsx.mongodb.net:27017/test?ssl=true&replicaSet=node-shop-shard-0&authSource=admin`, {});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATH, DELETE, GET');
        return res.status(200).json({});
    }
    next()
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;