
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index.js")
var User = require("../models/user.js")
var passport = require("passport")

//root page
router.get('/', function (req, res) {
	res.render("root"); 
});

//Register page
router.get("/register",function(req,res)
{
	res.render("register");
});


//Actually registering a new user
router.post("/register",function(req,res){
		User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err)
		{
			req.flash("error",err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to myExpressApp "+ req.body.username);
			res.redirect("/models");
		});
	});
});

//Login page
router.get("/login",function(req,res){

	res.render("login");
});


//Flash for successfull login redirects to models 
router.get("/successfullLogin",function(req,res){
		req.flash("success","Welcome "+req.user.username);
		res.redirect("/models");

})

//actually check's credentials 
router.post("/login",passport.authenticate("local",
	{
		successRedirect: "/successfullLogin",
		failureRedirect: "/login",
		failureFlash: true
	}),function(req,res){
		
});

//logout
router.get("/logout",function(req,res){
		req.logout();
		req.flash("success","Logged out Successfully");
		res.redirect("/login");
});


module.exports = router;