const product = require('../model/product')
const order = require('../model/order')
const user = require('../model/user')
const categories = require('../model/categories')
const cart = require('../model/cart')
const request = require("request");
const constants = require("../constants");
const multer = require('multer');
const { response } = require('express');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random() + "__" + file.originalname.toLocaleLowerCase());
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports.homePage = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : ''
    cart.find({
            userID: userData._id
        })
        .then(cartData => {
            product.find()
                .then(prodData => {
                    res.render('index', {
                        productObject: prodData,
                        cartDetails: cartData,
                        user: userData
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}


module.exports.orderProduct = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : null
    if (userData) {
        cart.find({
            userID : userData._id
        })
        .then(cartData=>{
            items=[]
            cartData.forEach(x=>{
                items.push({
                    userID : x.userID,
                    productID : x.productID,
                    quantity: x.quantity,
                    ip : userData.ip,
                    transactionDate : new Date().toLocaleDateString()
                })
            })
            
            order.insertMany(items)
            .then(data=>{
                cart.deleteMany({
                    userID : userData._id
                })
                .then(data=>{
                    res.redirect("/myorders")
                })
                .catch(err => {
                    res.send("0")
                    console.log(err)
                })
            })
            .catch(err => {
                res.send("0")
                console.log(err)
            })
        })
        .catch(err => {
            res.send("0")
            console.log(err)
        })
    } else {
        res.send("0")
    }
}

module.exports.myOrders = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : ''
    if (userData) {
        order.find({
                userID: userData._id
            })
            .then(orderData => {
                myprods = orderData.map(x => x.productID)
                product.find({
                        _id: { $in: myprods }
                    })
                    .then(prodData => {
                        res.render('myorders', {
                            productObject: prodData,
                            orders: orderData,
                            user: userData
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        res.redirect("/")
    }
}

module.exports.productDetails = (req, res, next) => {
    if (req.params['productID'] == undefined) {
        var searchQuery = {};
    } else {
        console.log(req.params['productID'])
        var searchQuery = { _id: { $in: req.params['productID'] } };
    }
    product.find(searchQuery).then((response) => {
        // console.log("product=" + JSON.stringify(response, null, 2));
        res.send(response)
    }).catch((error) => {
        console.log(error)
        res.send(error)
    })
}

module.exports.categories = (req, res, next) => {
    // console.log("category = " + req.params['category'])
    if (req.params['category'] == undefined) {
        var searchQuery = {};
    } else {
        var searchQuery = { category: { $in: JSON.parse(req.params['category']) } }
    }
    categories.find(searchQuery).then((response) => {
        // console.log(response);
        res.send(response)
    }).catch((error) => {
        res.send(error)
    })
}

module.exports.getOrderDetails = (req, res, next) => {
    console.log("entered get order details")
        // console.log(req.params['orderID']);
    if (req.params['orderID'] == undefined) {
        var searchQuery = {}
    } else {
        var searchQuery = { _id: { $in: JSON.parse(req.params['orderID']) } };
    }
    order.find(searchQuery).then((response) => {
        // console.log("order details = "+response)
        res.send(response)
    }).catch((error) => {
        res.send(error)
    })
}

module.exports.getUserDetails = (req, res, next) => {
    console.log("entered get user details")
        // console.log(req.params['userID']);
    if (req.params['userID'] == undefined) {
        var searchQuery = {}
    } else {
        var searchQuery = { _id: { $in: JSON.parse(req.params['userID']) } };
    }
    user.find(searchQuery).then((response) => {
        // console.log("user details = " +response)
        res.send(response)
    }).catch((error) => {
        res.send(error)
    })
}

module.exports.search = (req,res,next) =>{
    var userData = req.session.userDetails ? req.session.userDetails : []
    // var searchQuery = {$text: {$search: req.query.searchTerm}};
    var searchQuery = {
        $or: [
            { Title : {
                $regex: req.query.searchTerm,
                $options: 'i'
                }
            },
            { Author: {
                $regex: req.query.searchTerm,
                '$options': 'i'
                }
            },
            { Category: {
                $regex: req.query.searchTerm,
                '$options': 'i'
                }
            }
        ]
    }
    product.find(searchQuery)
    .then(prodData=>{
        cart.find({
                userID: userData._id
        })
        .then(cartData => {
            res.render('product/search',{
                productObject: prodData,
                cartDetails: cartData,
                user: req.session.userDetails
            })
        })
    })
    .catch(err=>{
        console.log(err)
        res.send("0")
    })
}