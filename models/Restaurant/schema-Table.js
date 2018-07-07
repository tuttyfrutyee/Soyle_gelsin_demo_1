const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = require("../Order/schema-Order.js");

var tableSchema = new Schema({
	customers : [String],
	tableNo : Number,
	orders : [orderSchema],
	bill : Number,
	billPaid : Boolean,
	tableIsFull : Boolean,
	lastUpdate : Date
})


module.exports = tableSchema;