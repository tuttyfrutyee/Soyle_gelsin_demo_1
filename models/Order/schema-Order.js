const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
	productName : String,
	cost : Number,
	customerName : String,
	deliveryState : String,
	orderDate : Date
})


module.exports = OrderSchema