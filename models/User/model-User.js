const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	username : String,
	password : String,
	admin : Boolean,
	restaurants : [String]
})

var User = mongoose.model("user",UserSchema);

module.exports = User;