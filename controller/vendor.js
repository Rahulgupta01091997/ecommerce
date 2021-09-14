const request = require("request");
const constants = require("../constants");
const productModel = require('../model/product');
const categories = require('../model/categories');
const order = require('../model/order');
const reviewModel = require('../model/review');
const userModel = require('../model/user');
const { response } = require("express");
const multer = require('multer');
var randomip = require('random-ip');
const fs = require('fs'); 
const orderModel = require('../model/order');
var sha256 = require('js-sha256').sha256;

function CreateCamelCase(txt){  
    let string = txt.split(" ")
    for (i=0;i<string.length;i++)
    string[i]=string[i].charAt(0).toUpperCase() + string[i].slice(1).toLocaleLowerCase();
    return string.join(" ");
}
  

module.exports.getProductsforVendor = (req,res,next)=>{
    request(constants.websiteURL+ "ProductDetails/", { json: true }, (err, productRes, body) => {
        request(constants.websiteURL+ "categories/", { json: true }, (err, categoryRes, categoryData) => {
            res.render('vendor/vendorproducts',{
                productObject:body,
                categoryObject:categoryData,
                user:(req.session.userDetails) ? req.session.userDetails : ''
            });
        });
    });    
}

module.exports.addproductpage = (req,res,next)=>{
    console.log("entered add new product page controller")
    request(constants.websiteURL+ "categories/", {json: true }, (err, catres, categoryData) => {
        // console.log("categories = "+JSON.stringify(categoryData,null,2))
        res.render('vendor/addproduct',{
            categoryObject: categoryData,
            user: req.session.userDetails ? req.session.userDetails : ''
        });
    });
}

module.exports.addnewcategory = (req,res,next) =>{
    console.log("entered addnew category controller")
    console.log(req.body.newCategory)
    var newcategory = new categories({
        category: req.body.newCategory
    })
    newcategory.save().then((response) => {
        console.log(response);
        res.send(response)
    }).catch((error) => {
        res.send(error)
    })
}

module.exports.updateproductcategory = (req,res,next)=>{
    console.log('_id = ' +req.body._id+',productCategory ='+ req.body.productCategory)
    categories.updateOne(
      { _id:req.body._id},{$set : {category:req.body.productCategory}}).then((response)=>{
      res.send(response);
    }).catch((error)=>{
      console.log(error)
      res.send(error);
    });
}

module.exports.deleteCategory = (req,res,next) => {
    console.log("entered delete category db")
    console.log(req.body._id)
    categories.deleteOne({_id : req.body._id}).then((response) => {
        console.log(response)
        res.send(response)
    }).catch((err) => {
        res.send(err)
    })
}
  

// ----------------------------- BOOK IMAGE UPLOAD FUNCTIONALITY-----------------------//

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "__" + file.originalname.toLocaleLowerCase());
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

module.exports.addnewProduct = (req,res,next) => {
    console.log("entered add new product controller")
    upload.single('primaryImage')(req, res, ()=>{
        // console.log(req.file)
        // console.log(req.body)
        var newproduct = new productModel({
            Title: CreateCamelCase(req.body.productName),
            Desc: req.body.productDesc,
            Category: req.body.addproductsCategory,
            Author: req.body.author,
            Image: req.file.path.substring(6),
            Price: req.body.regPrice
        })
        newproduct.save().then((response) => {
            console.log(response)
            res.send(response);
        }).catch((error) =>{
            console.log(error)
            res.send(error)
        })
    })
}

module.exports.deleteProduct = (req,res,next) => {
    console.log("entered delete product controller")
    console.log("body = " + req.body._id)
    // console.log("path = " + req.body.path)
    productModel.deleteOne({_id : req.body._id}).then((response) =>{
        fs.unlinkSync("public"+req.body.path)
        console.log(response)
        res.send(response)
    }).catch((err) => {
        console.log(err)
        res.send(err)
    })
}

module.exports.deleteselectedproduct = (req,res,next) => {
    console.log("entered deleted multiple products controller");
    console.log(req.body.id_list)
    productModel.deleteMany({_id : { $in : req.body.id_list}}).then((response) => {
        req.body.prodimg.forEach(path =>{
            fs.unlinkSync("public"+path)
        })
        console.log(response);
        res.send(response)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
}


module.exports.editProductDetails = (req,res,next) => {
    console.log("entered edit product details controller")
    upload.single('editprimaryImage')(req,res, () => {
        console.log(req.file)
        // console.log(req.body)
        if(req.file == undefined){
            var primaryimgpath = req.body.oldprimaryImage
        } else {
            fs.unlinkSync("public"+req.body.oldprimaryImage)
            var primaryimgpath = req.file.path.substring(6)
        }
        // console.log("primaryimgpath = "+ primaryimgpath)
        productModel.updateOne({_id : req.body._id}, {$set : {Title: req.body.productName, Desc: req.body.editproductDesc, Category: req.body.addproductsCategory, Author: req.body.author, Image: primaryimgpath, Price: req.body.regPrice}}).then((response) => {
            // console.log(response)
            res.send(response)
        }).catch((err) => {
            console.log(err)
            res.send(err)
        })
    })
}

module.exports.updatereviewstatus = (req, res, next) => {
    console.log("entered update review status")
    console.log(req.body)
    reviewModel.updateOne({_id: req.body._id}, {$set : {isVerified : req.body.status}}).then((response) => {
        res.send(response)
    }).catch((err) => {
        console.log(err)
        res.send(err)
    })
}

module.exports.deleteuser = (req,res,next) => {
    console.log("entered delete user controller")
    console.log(req.body._id)
    reviewModel.deleteMany({userID:req.body._id}).then((response)=>{
        order.deleteMany({userID:req.body._id}).then((response)=>{
            userModel.findOneAndDelete({_id: req.body._id}).then((response)=>{
                console.log(response)
                res.send(response)
            }).catch((err)=>{
                res.send(err)
            })
        }).catch((err)=>{
            res.send(err)
        })
    }).catch((err)=>{
        res.send(err)
    })
}

module.exports.addnewuser = (req,res,next)=>{
    console.log("entered add new user controller")
    // console.log(req.body)
    userModel.findOne({
        userEmail: req.body.email
    }).then((response)=>{
        if(response){
            console.log("entered if")
            console.log("email already exists")
            res.status(400).send("0");
        } else {
            console.log("entered else")
            var userEntry = new userModel({
                userEmail: req.body.email,
                userPassword: sha256(req.body.password),
                userName: req.body.name,
                ip: randomip('0.0.0.0',1)
            });
            userEntry.save().then((response) => {
                console.log(response)
                res.status(200).send("1");
            }).catch((error) => {
                res.status(400).send("0");
            });
        }
    }).catch((err)=>{
        console.log(err)
        // console.log("didnot find email")
        res.status(400).send("0");
    })
}