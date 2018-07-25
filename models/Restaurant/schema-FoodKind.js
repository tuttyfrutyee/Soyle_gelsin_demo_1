const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const foodSchema = require("./schema-Food.js");

var schemaFoodKind = new Schema({
	kType : String,
	products : [foodSchema]
})


module.exports = schemaFoodKind;
