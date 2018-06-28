var express = require("express")
var mongoose = require("mongoose");
var router = require("./routes/app.js")
var passport = require("passport")
var cookieSession = require("cookie-session");
var bodyParser = require("body-parser");
//passport-setup
	require("./config/passport-setup.js")

var bodyParser = require("body-parser");

var app = express()

mongoose.connect("mongodb://localhost/Soyle_Gelsin",function(err){
	if(err) console.log(err)
	else console.log("connected to mLab");
})
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(cookieSession({
	maxAge : 24 * 60 * 60 * 1000,
	keys: ["tuttyfrutyee"]
}));

app.use(bodyParser.urlencoded({extended:false}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/",router);



// use the router and 401 anything falling through



app.listen(3000 , function(){
	console.log("3000 port listening")
});
