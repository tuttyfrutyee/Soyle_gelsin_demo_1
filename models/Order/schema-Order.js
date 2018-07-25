const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
	productName : String,
	kType : String,
	cost : Number,
	customerName : String,
	deliveryState : String,
	orderDate : Date,
	tableNo : Number,
	orderCount : Number
})


module.exports = OrderSchema
