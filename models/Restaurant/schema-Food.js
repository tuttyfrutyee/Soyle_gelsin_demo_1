const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schemaFoodDataBase = new Schema({
	pType : String,
	pName : String,
	cost : Number,
	
})


module.exports = schemaFoodDataBase;
