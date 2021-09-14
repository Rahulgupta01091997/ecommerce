/* customer model*/
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    productID: {type: String, required: true},
    userID:{type:String,required:true},
    quantity:{type:Number},
    transactionDate:{type:String},
    ip:{type:String},
  });
 
module.exports = mongoose.model("orders", orderSchema);
