const user = require("../model/user");
var sha256 = require('js-sha256').sha256;
const IPs=[
    '46.124.216.180',
    '51.58.16.66',
    '49.17.81.195',
    '61.132.59.172',
    '92.182.183.242',
    '22.233.22.71',
    '85.221.224.142',
    '74.149.11.119',
    '121.123.72.32',
    '93.130.95.33'
  ]
module.exports.signup = (req, res, next) => {
    const random = Math.floor(Math.random() * IPs.length);
    var userEntry = new user({
        userEmail: req.body.email,
        userPassword: sha256(req.body.password),
        userName: req.body.name,
        userAddress: req.body.address,
        userContact: req.body.contact,
        ip: IPs[random]
    });
    userEntry.save().then((response) => {
        response.userPassword = ""
        req.session.userDetails = response
        res.status(200).send("1");
    }).catch((error) => {
        res.status(400).send("0");
    });
}

module.exports.signin = (req, res, next) => {
    user.findOne({
        userEmail: req.body.login_email,
        userPassword: sha256(req.body.login_pass)
    }).then((response) => {
        if (response != null) {
            response.userPassword = ""
            req.session.userDetails = response
            res.status(200).send("1");
        } else
            res.status(200).send("0");
    }).catch((error) => {
        res.status(200).send("0");
    });
}

module.exports.admin_signin = (req, res, next) => {
    user.findOne({
        userEmail: req.body.login_email,
        userPassword: sha256(req.body.login_pass)
    }).then((response) => {
        if (response.isVendor) {
            response.userPassword = ""
            req.session.userDetails = response
            res.status(200).send("1");
        } else
            res.status(200).send("0");
    }).catch((error) => {
        res.status(200).send("0");
    });
}
