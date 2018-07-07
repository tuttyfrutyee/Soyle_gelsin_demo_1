const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaTable = require("./schema-Table.js");
const schemaFood = require("./schema-Food.js");

var schemaRestaurant = new Schema({
	rIndicator : String,
	products : [schemaFood],
	tables : [schemaTable],
	lastUpdate : Date
})

var modelRestaurant = mongoose.model("Restaurant",schemaRestaurant)

module.exports = modelRestaurant;
