const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schemaFoodDataBase = new Schema({
	pName : String,
  kType : String,
	cost : Number,
})


module.exports = schemaFoodDataBase;
