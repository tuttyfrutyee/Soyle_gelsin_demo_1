var Restaurant = require("../models/Restaurant/model-Restaurant.js");
var User = require("../models/User/model-User.js")

var public_api = {};

public_api.registerRestaurant = function(restaurantName){
	Restaurant.create({rIndicator : restaurantName , lastUpdate : Date()},function(err, restaurant){
		if(!err){
			return true
		}else{
			return false
		}
	})
}

public_api.createTables = function(tableCount , restaurantName){
	Restaurant.findOne({rIndicator : restaurantName}, function(err, restaurant){
		if(err)return err
			else{
				if(restaurant){
					var tables = restaurant.tables;
					var initialLastTableNo = tables.length
					for(var i = 1 ; i <= tableCount ; i++){
						tables.push({tableNo : i + initialLastTableNo , bill : 0 , billPaid : true, tableIsFull : false , lastUpdate : Date()})
					}
					restaurant.save(function(changedRestaurant){
						return true
					})
				}else{
					return false
				}
			}
	})
}

public_api.joinTableAsCustomer = function(customerName , restaurantName , tableNo){
	Restaurant.findOne({rIndicator : restaurantName},function(err,restaurant){
		if(err)return false
			else{
				if(restaurant){
					//adding customerName
					restaurant.tables[tableNo-1].tableIsFull = true
					 restaurant.tables[tableNo-1].customers.push(customerName)
					 restaurant.save(function(changedRestaurant){
					 	return true;
					 })
				}else{
					return false
				}
			}
	})
}

public_api.giveOrder = function(restaurantName , tableNo , customerName, productName ){
	return new Promise(function(resolve,reject){
			Restaurant.findOne({rIndicator : restaurantName} , function(err, restaurant){
			if(!err){
				var orders = restaurant.tables[tableNo-1].orders;
				orders.push({productName:productName, customerName : customerName , orderDate : Date() , deliveryState : "Bekliyor"});
				restaurant.save(function(err , changedRestaurant){
					if(err) reject("something went wrong when saving")
					else resolve(changedRestaurant)
				})
			}else{
				return reject("something went wrong when finding restaurant")
				}
			})
	})

};

public_api.createUser = function(username , password ,restaurantName, isAdmin){
	User.create({username : username , password : password ,restaurants:[restaurantName], isAdmin : isAdmin},function(err, user){
		if(err)return false
			else return true
	})
}

public_api.createFoodDataBase = function(restaurantName, pType, pName, cost){
	Restaurant.findOne({rIndicator:restaurantName},function(err,restaurant){
		var products = restaurant.products
		products.push({pType : pType , pName : pName, cost : cost})
		restaurant.save(function(err, changedRestaurant){
			if(changedRestaurant)return true
				else return true
		})
	})
}

public_api.addCostToOrderInTable = function(restaurant , table){
		for(var i = 0 ; i < table.orders.length; i++){
			for(var j = 0; j < restaurant.products.length; j++){
				if(table.orders[i].productName === restaurant.products[j].pName){
					table.orders[i].cost = restaurant.products[j].cost
					break;
				}
			}
		} 
	
}
public_api.getAllOrders = function(restaurantName){
	return new Promise(function(resolve,reject){
			Restaurant.findOne({rIndicator : restaurantName}).lean().exec(function(err,restaurant){

			if(!err && restaurant){
				var orders = new Array()
				restaurant.tables.forEach(function(table){
					orders = orders.concat(table.orders);
				});
				resolve(orders);
			}else{
				reject("whouups something went wrong when getting all the orders")
			}
				
		})
			})
	}

public_api.getUpdatedOrders = function(restaurantName, lastUpdate){
	return new Promise(function(resolve,reject){
		Restaurant.findOne({rIndicator : restaurantName},function(err,restaurant){
			if(!err && restaurant){
				var orders = new Array()
				restaurant.tables.forEach(function(table){
					table.orders.forEach(function(order){
						if(order.orderDate > restaurant.lastUpdate){
							orders.push(order);
						}
					})
				})
				restaurant.lastUpdate = Date()
				restaurant.save(function(err , changedRestaurant){
					if(err) reject("something went wrong when saving // from getUpdatedOrders")
					else resolve(orders);
				})
				
			}else{
				reject("whoops something went wrong when getting updated orders")
			}
		})
	})
}



module.exports = public_api;