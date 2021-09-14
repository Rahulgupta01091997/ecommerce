const express = require('express')
const request = require("request");
const constants = require("../constants");

const vendorController = require('../controller/vendor');
const productController = require("../controller/product");

const router = express.Router();

router.get('/vendorproducts',vendorController.getProductsforVendor);
router.get("/categories/:category?/", productController.categories);
router.get("/ProductDetails/:productID?/", productController.productDetails);
router.get('/orderDetails/:orderID?/',productController.getOrderDetails)
router.get('/userData/:userID?/',productController.getUserDetails)
router.get('/addproduct',vendorController.addproductpage);
router.post('/newcategories',vendorController.addnewcategory);
router.post('/addnewProduct',vendorController.addnewProduct);
router.delete('/deleteproduct',vendorController.deleteProduct);
router.delete('/deletecategory',vendorController.deleteCategory);
router.delete('/deleteselectedproduct', vendorController.deleteselectedproduct);
router.put('/updateproductcategory', vendorController.updateproductcategory);
// router.get('/ordermanagement',vendorController.ordermanagement);
// router.post('/changeorderstatus', vendorController.changeorderstatus);
// router.get('/getreview/:productID?/', vendorController.getreview);
router.get('/editproduct/:productId?', function(req, res){
    console.log(req.params['productId'])
    var user = (req.session.userDetails != undefined) ? req.session.userDetails._id : undefined;
    // var findProduct = {
    //   productID: [req.params['productId']]
    // }
    request(constants.websiteURL+"ProductDetails/"+ req.params['productId'], { json: true }, (err, productdetailsRes, productdetailsData) => {
        request(constants.websiteURL+ "categories/", { json: true }, (err, categoryRes, categoryData) => {
            // console.log("res="+ JSON.stringify(productdetailsRes.body[0], null, 2))
            // console.log("categories = " + JSON.stringify(categoryData, null, 2))
            res.render('vendor/editproduct',{
              user:(req.session.userDetails) ? req.session.userDetails : '',
              productdetailsobject: productdetailsRes.body[0],
              categoryObject: categoryData
            });
        });
    });
});
router.get('/vendorreview', function(req, res){
    request(constants.websiteURL+ 'getreview/', {json : true}, (err, reviewres, reviewData) => {
        request(constants.websiteURL+ "ProductDetails/", { json: true }, (err, productRes, body) => { 
            request(constants.websiteURL + "userData/", { json : true }, (err, userres, userData) => { 
                // console.log(JSON.stringify(userData, null, 2));
                res.render('vendor/vendorreview',{
                    user:(req.session.userDetails) ? req.session.userDetails : '',
                    prodObject: body,
                    reviewObject: reviewData,
                    userObject: userData
                });
            })
        })
    })
})
router.post('/editProductDetails',vendorController.editProductDetails);
router.put('/updatereviewstatus', vendorController.updatereviewstatus);
router.get('/addnewuser', function(req,res){
    request(constants.websiteURL+'userData/', {json : true}, (err, userres, userData) => {
        // console.log(JSON.stringify(userData, null, 2))
        res.render('vendor/manageuser',{
            userObject: userData,
            user:(req.session.userDetails) ? req.session.userDetails : ''
        })
    })
});
router.delete('/deleteuser', vendorController.deleteuser);
router.post('/addnewuser', vendorController.addnewuser)

module.exports = router;