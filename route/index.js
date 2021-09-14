const express = require('express')

const productController = require("../controller/product");
const productdetail = require("../controller/productdetails");
const userdetail = require("../controller/user");
const router = express.Router();

router.get("/", productController.homePage);
// router.get("/addproduct", productController.addProductPage);
// router.post("/addproduct", productController.addProduct);
router.post("/orderproduct", productController.orderProduct);
router.get("/myorders", productController.myOrders);
router.get("/myorder/:productID?", productdetail.myOrder);
router.get("/getreview/:productID?", productdetail.getreview);
router.post("/addreview", productdetail.addreview);
router.get("/products/:productID?", productController.productDetails);
router.get("/product/:productID?", productdetail.productDetailsPage);
router.get('/search',productController.search);

router.get('/profile',userdetail.profilePage);
router.post('/profile',userdetail.updateProfile);

module.exports = router;