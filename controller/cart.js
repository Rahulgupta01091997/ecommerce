const cart = require('../model/cart')
const product = require('../model/product')

module.exports.cartPage = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : null
    if(userData){
        cart.find({
            userID: userData._id
        })
        .then(cartData => {
            product.find()
                .then(prodData => {
                    res.render('product/cart', {
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
    else{
        res.redirect("/")
    }
}

module.exports.updateCartQuantity = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : null
    if(userData){
        cart.findByIdAndUpdate(req.body.id,{
            quantity : parseInt(req.body.quantity)
        })
        .then(data=>{
            res.send("1")
        })
        .catch(err=>{
            res.send("0")
        })
    }else{
        res.send("-1")
    }
}
module.exports.addToCart = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : null
    if(userData){
        new cart({
            userID : userData._id,
            productID : req.body.pid,
        })
        .save()
        .then(data=>{
            console.log(data)
            res.send("1")
        })
        .catch(err=>{
            console.log(err)
            res.send("0")
        })
    }
    else{
        res.send("-1")
    }
}

module.exports.deleteFromCart = (req, res, next) => {
    cart.findByIdAndDelete(req.body.cid)
    .then(data=>{
        res.send("1")
    })
    .catch(err=>{
        res.send("0")
    })
}


module.exports.checkoutPage = (req, res, next) => {
    userData = req.session.userDetails ? req.session.userDetails : null
    if(userData){
        cart.find({
            userID: userData._id
        })
        .then(cartData => {
            product.find()
                .then(prodData => {
                    res.render('product/checkout', {
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
    else{
        res.redirect("/")
    }
}
