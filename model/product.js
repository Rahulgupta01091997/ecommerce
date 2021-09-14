/* customer model*/
const mongoose = require('mongoose');

const productDetailSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Desc: {type: String, required: true},
    Price:{type:Number,required:true},
    Category: {type:String, required: true},
    Image: {type:String},
    Author: {type:String},
  });
// productDetailSchema.index({Title: 'text', Author :'text'}, {weights: {Title: 2,Author: 1}});
module.exports = mongoose.model("products", productDetailSchema);
