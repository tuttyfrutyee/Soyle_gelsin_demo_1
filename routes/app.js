var express = require("express");
var router = express.Router();
var passport = require("passport"); 

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
	res.render("./Masalar/home.ejs" ,{data : {table_count : 5}});}
	else{
		return res.redirect("/login");
	}
});

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
})


module.exports = router
