const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewares/check-auth');
const productController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get("/", productController.product_get_all);


router.post("/", checkAuth, upload.single('productImage'), productController.products_create_product);

router.get("/:productId", productController.products_get_one);

router.patch("/:productId", checkAuth, productController.products_update_product);

router.delete("/:productId", checkAuth,productController.products_delete_product);


module.exports = router;