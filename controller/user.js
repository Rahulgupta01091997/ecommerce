const user = require("../model/user");
var sha256 = require('js-sha256').sha256;

module.exports.profilePage = (req, res, next) => {
    if(req.session.userDetails){
        res.render('profile',{
            user : req.session.userDetails
        })
    }
    else
        res.redirect("/")
}

module.exports.updateProfile = (req, res, next) => {
    if(req.session.userDetails){
        user.findOneAndUpdate(
        {
            _id : req.body.id
        },
        {
            userName : req.body.name,
            userContact : req.body.contact,
            userAddress : req.body.address,
            userPassword : sha256(req.body.pass)
        },
        {
            new: true
        })
        .then(response=>{
            response.userPassword = ""
            req.session.userDetails = response
            res.send('1')
        })
        .catch(err=>{
            res.send('0')
        })
    }
    else
        res.send('0')
}
