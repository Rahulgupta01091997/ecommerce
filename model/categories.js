const mongoose = require('mongoose')

const categoriesSchema = mongoose.Schema({  
  category: { type: String, required: true, unique:true }
  });
  
  
module.exports = mongoose.model("categories", categoriesSchema);
