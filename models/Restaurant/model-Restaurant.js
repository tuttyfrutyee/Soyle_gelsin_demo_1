const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaTable = require("./schema-Table.js");
const schemaFoodKind = require("./schema-FoodKind.js");

var schemaRestaurant = new Schema({
	rIndicator : String,
	productKinds : [schemaFoodKind],
	tables : [schemaTable],
	lastUpdate : Date
})

var modelRestaurant = mongoose.model("Restaurant",schemaRestaurant)

module.exports = modelRestaurant;
