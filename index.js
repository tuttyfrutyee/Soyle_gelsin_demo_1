//Global variables
Socket_bag = {};


var express = require("express")
var secrets = require("./private/secrets.js")
var http = require("http")
var mongoose = require("mongoose");
var router = require("./routes/app.js")
var passport = require("passport")
var expressSession = require("express-session")
var MongoStore = require("connect-mongo")(expressSession);
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var socketio = require("socket.io");
var passportSocketIo = require("passport.socketio");
var DataBaseApi = require("./routes/dataBaseApi.js")
//passport-setup
	require("./config/passport-setup.js")

var bodyParser = require("body-parser");



var app = express()
var server = app.listen(3000, function(){
	console.log("3000 port listening")
});
var io = socketio(server);

//database connection
mongoose.connect(secrets.mLab_connect,function(err){
	if(err) console.log(err)
	else console.log("connected to mLab");
})

var myMongoStore = new MongoStore({url : secrets.mLab_connect , autoReconnect: true});

//app use configures
app.set("view engine","ejs");
app.use(express.static("public"));


app.use(expressSession({
	store: myMongoStore,
    secret: 'tuttyfrutyee',
    resave: false,
    saveUninitialized : false,
    unset : "destroy",
    cookie : {maxAge : 1000 * 60 * 60 * 12}
}));

app.use(bodyParser.urlencoded({extended:false}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/",router);


//io configures
io.use(passportSocketIo.authorize({
	key:"connect.sid",
	secret : "tuttyfrutyee",
	store : myMongoStore,
	cookieParser : cookieParser,
	success:  onAuthorizeSuccess,
    fail:    onAuthorizeFail,
}))

io.on("connection",function(socket){
	console.log("socket connection has been constructed");
	if(socket.request.user.logged_in){
		var restaurantName = socket.request.user.restaurants[0];
		if(Socket_bag[restaurantName] == null){
			Socket_bag[restaurantName] = [{lastUpdate : Date(), socket : socket}];
		}else{
			Socket_bag[restaurantName].push({lastUpdate: Date(), socket: socket});
		}
		 //making browsers to update the button javascripts...
		socket.emit("aktif_siparis_listesi_update","" )

		socket.on("disconnect",function(){
			var i = 0
			Socket_bag[restaurantName].forEach(function(socketCandidate){
				if(socketCandidate.socket === socket){
					Socket_bag[restaurantName].splice(i,1);
				}
				i++;
			})
		})
	}

});


// use the router and 401 anything falling through

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);}

function onAuthorizeFail(data, message, error, accept){
  if(error)
	console.log(message);
  console.log('failed connection to socket.io:', message);

  // We use this callback to log all of our failed connections.
  accept(null, false);
}
