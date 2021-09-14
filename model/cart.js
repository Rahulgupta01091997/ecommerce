/* customer model*/
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    productID: {type: String, required: true},
    userID:{type:String,required:true},
    quantity:{type:Number, default :1}
  });
 
module.exports = mongoose.model("cart", cartSchema);
