var express = require("express");
var router = express.Router();
var passport = require("passport");
var Restaurant = require("../models/Restaurant/model-Restaurant.js")
var User = require("../models/User/model-User.js")
var DataBaseApi = require("./dataBaseApi.js")
var ejs = require("ejs");

router.get("/",function(req,res){
	res.redirect("/login");
})

router.get('/login', function (req, res) {
  res.render("login");
})

router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");

})

router.get("/home",function(req,res){
	if(req.user){
	 Restaurant.findOne({rIndicator : req.user.restaurants[0]}, function(err, restaurant){
	 	if(restaurant){
	  var tables = [];
	  restaurant.tables.forEach(function(table){
	  	tables.push(table.tableIsFull);
	  })
		var orderedOrders = DataBaseApi.getAllPendingOrdersWithOrder(restaurant);
	  	  res.render("./Masalar/home.ejs" ,{tables : tables , orders : orderedOrders});
		//making browsers to update the button javascripts...

	 }else{
	 	res.send("woops no such restaurant exist")
	 }})
	}

	else{
		return res.redirect("/login");
	}
});

router.get("/restaurantMaker",function(req,res){
	res.render("./dataBaseMaker/restaurantMaker.ejs")
})

router.get("/signIn",function(req,res){
	res.render("./dataBaseMaker/signUpPage.ejs")
})

router.post("/home",function(req,res){
	  passport.authenticate('local', function(err, user, info) {
    if (err) {
    	return res.redirect("/home"); }

    if (!user) { return res.redirect('/login'); }


    req.logIn(user, function(err) {

      if (err) { return res.end(err); }
      return res.redirect("/home");
    });
  })(req, res);
});

router.post("/dataBase/maker/createRestaurant",function(req,res){
	DataBaseApi.registerRestaurant(req.body.restaurantName);
	res.end("Restoran kaydoldu")
})

router.post("/dataBase/maker/joinTable",function(req,res){
	DataBaseApi.joinTableAsCustomer(req.body.customerName, req.body.restaurantName ,req.body.tableNo);
	res.end("joinedTable")
})

router.post("/dataBase/maker/createTables",function(req,res){
	DataBaseApi.createTables(req.body.tableCount, req.body.restaurantName)
	res.end("createdTables");
});

router.post("/dataBase/maker/orderFood",function(req,res){
	DataBaseApi.giveOrder(req.body.restaurantName , req.body.tableNo , req.body.customerName,req.body.kType, req.body.productName, req.body.orderCount ).then((updatedRestaurant)=> {
				DataBaseApi.getUpdatedOrders(req.body.restaurantName , Date()).then(function(updatedOrderList){
					ejs.renderFile('/Users/tuttyfruty/Documents/Soyle_gelsin_demo_1/views/Masalar/aktif_siparis_listesi_partial.ejs', {data : updatedOrderList}, function(err, str){
						console.log(err)
						console.log(updatedOrderList)
							Socket_bag[req.body.restaurantName].forEach(function(socket_bag){
							socket_bag.socket.emit("aktif_siparis_listesi_update",str )
						})
					});

				}).catch(function(err){console.log(err)})
		})
	//socket emitting for realtime data
	res.end("gaveTheOrder")
})

router.post("/dataBase/maker/foodDataBase",function(req,res){
	DataBaseApi.createFoodDataBase(req.body.restaurantName, req.body.productType , req.body.productName , req.body.cost)
		res.end("added food to database")
})

router.post("/dataBase/maker/signUp",function(req,res){
	var isAdmin
	if(req.body.admin){
		isAdmin = true
	}else{
		isAdmin = false
	}
	DataBaseApi.createUser(req.body.userName , req.body.password ,req.body.restaurantName, isAdmin);
	res.end("user created")
	//DataBaseApi.createUser()
})


//Attention : table index start with 0 , but tableNo start with 1
router.post("/table_info",function(req,res){
	if(req.user){
		User.findOne({username : req.user.username} , function(err , user){
			if(!err){
			 Restaurant.findOne({rIndicator : user.restaurants[0]},function(err , restaurant){
	    		if(!err){
	    			if(restaurant.tables[req.body.table_index].tableIsFull){
	    				DataBaseApi.addCostToOrderInTable(restaurant,restaurant.tables[req.body.table_index]);
					res.render("./Masalar/table_info_partial.ejs",{table_info : restaurant.tables[req.body.table_index]});}
					else{
						res.end("<p style='font-size: 3vmin; text-align : center'> Masada kimse yok </p>")
					}
				}else{
					res.render(err)
				}
			})
		}else{
			console.log(err)
		}
	})

}})

router.post("/handle/orderButtons",function(req,res){
	if(req.user){
		Restaurant.findOne({rIndicator : req.user.restaurants[0]} , function(err,restaurant){
			if(!err){
				if(!restaurant){res.end("false"); return;}
				var targetOrder;
				for(var i = 0  ; i < restaurant.tables.length ; i++){
					for(var j = 0; j < restaurant.tables[i].orders.length; j++){
						if(restaurant.tables[i].orders[j]._id.toString() === req.body.orderId){
							targetOrder = restaurant.tables[i].orders[j];
							break;
						}
					}
				}

				//console.log(targetOrder)

				switch(targetOrder.deliveryState.toString()){
					case "Bekliyor":
						targetOrder.deliveryState = "Alındı";
						restaurant.save(function(changedRestaurant){res.json({success : "true" , deliveryState : "Alındı"})})
					break;
					case "Alındı":
						targetOrder.deliveryState = "Teslim Edildi"
						restaurant.save(function(changedRestaurant){res.json({success : "true" , deliveryState : "Teslim Edildi"})})
					break;
					default:
					//Something went wrong clearly
					res.end("false");
					break;
				}

			}else{
				res.end(err)
			}
		})
	}
})

// ios posts

router.post("/ios/post",function(req,res){
	console.log(req.path)
	console.log("a post request received from ios device")
	res.end("Hello brother");
})


module.exports = router
