const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName:{type:String, required: true},
    userEmail:{type:String, required: true, unique:true },
    userPassword:{type:String, required: true},
    ip: {type:String, required: true},
    isVendor:{type:Boolean},
    userAddress:{type:String},
    userContact:{type:Number},
  });

module.exports = mongoose.model("user", userSchema);