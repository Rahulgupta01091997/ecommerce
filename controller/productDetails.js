const productDetailModel = require("../model/product");
const orders = require("../model/order");
const users = require("../model/user");
const review = require("../model/review");
const cart = require('../model/cart')
const constants = require('../constants');
const path = require('path');
const request = require('request');

// --------------------------------------------------------
// ---------------Add Review functionality---------------
// --------------------------------------------------------

module.exports.addreview = (req, res, next) => {
    var userID = req.session.userDetails ? req.session.userDetails._id : undefined;
    // console.log(req.body,userID)

    orders.find({
        "productID": req.body.productID,
        "userID": userID
    }).then((orderRes) => {

        if (orderRes.length) {
            var myreview = {
                userID: userID,
                productID: req.body.productID,
                rating: req.body.rating,
                review: req.body.review,
                ip: req.session.userDetails.ip,
                timestamp: Date.now(),
                isVerified: "false"
            }
            review.findOneAndUpdate({
                    userID: userID,
                    productID: req.body.productID
                },
                myreview, {
                    upsert: true,
                    new: true,
                    runValidators: true
                }).then((resp) => {
                res.send(resp)
                    // console.log(resp)
            })
        } else {
            res.send('0')
        }
    })
}

module.exports.getreview = (req, res, next) => {
    console.log("entered get review controller")
    if (req.params['productID'] == undefined) {
        var searchQuery = {};
    } else {
        console.log(req.params['productID'])
        var searchQuery = { productID: { $in: req.params['productID'] } };
    }
    review.find(searchQuery).sort({ timestamp: -1 }).then((response) => {
        // console.log("revies response : " + response)
        res.send(response)
    }).catch((err) => {
        console.log(err)
    })
}

module.exports.productDetailsPage = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : ''
    request(constants.websiteURL + "products/" + req.params['productID'], { json: true }, (err, productRes, body) => {
        orders.findOne({
            productID : req.params['productID'],
            userID : userData._id
        })
        .then(orderRes => {
            request(constants.websiteURL + "getreview/" + req.params['productID'], { json: true }, (err, reviewRes, reviewreq) => {
                isOrdered = false;
                inCart = false;
                cart.findOne({
                    productID: req.params['productID'],
                    userID: userData._id
                }).then((cartRes) => {
                    if (orderRes)
                        isOrdered = true
                    if (cartRes)
                        inCart = true
                    users.find({
                        _id: reviewRes.body.map(u => u.userID)
                    }, {
                        userName: 1,
                    }).then((userRes) => {
                        res.render('product/productdetails', {
                            productObject: body[0],
                            reviewDetails: reviewRes ? reviewRes : '',
                            reviewedUsers: userRes,
                            isOrdered: isOrdered,
                            inCart : inCart,
                            orders: orderRes,
                            user: (req.session.userDetails) ? req.session.userDetails : '',
                            websiteURL: constants.websiteURL,
                        });
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                });
            });
        });
    });
}

module.exports.myOrder = (req, res, next) => {
    // console.log("category = " + req.params['category'])
    userData = req.session.userDetails ? req.session.userDetails : ''
    if (userData) {
        var searchQuery = { category: req.params['category'], userID: userData._id }
        categories.find(searchQuery).then((response) => {
            // console.log(response);
            res.send(response)
        }).catch((error) => {
            res.send(error)
        })
    } else {
        res.redirect("/homepage")
    }
}