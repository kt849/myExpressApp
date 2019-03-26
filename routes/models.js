var Model = require("../models/model");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index.js")


// Show page for all posts
router.get("/",function(req, res) {
	
		Model.find({},function(err,models)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					res.render("models",{models:models});
				}
			});
});

//Create a new post
router.post("/",middleware.isLoggedIn,function(req,res) {
	//console.log("Post request sent");
	Model.create({
			name: req.body.name,
			image: req.body.iurl,
			description: req.body.description,
			author: {
			id: req.user._id,
			username: req.user.username
		}
	},function(err,newo)
		{
			if(err)
			{
				console.log(err);
				req.flash("error","Something went wrong");
			}
			else
			{
				req.flash("success","Post created successfully");
				res.redirect("/models");
			}
		});
});

//Add a new post
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("new");
});


//Show detailed page about a post
router.get("/:id",function(req,res){
	Model.findById(req.params.id).populate("comments").exec(function(err,model){
		if(err)
		{
			console.log(err);
			req.flash("error","Something went wrong");
		}
		else
		{

			res.render("show",{model:model});
		}
	});
});


//Update POST

router.get("/:id/edit", middleware.checkOwnership, function(req,res){
	Model.findById(req.params.id, function(err, foundModel){
		if(err)
		{
			console.log(err);
			req.flash("error","Something went wrong");
			res.redirec("back");
		}
		else
		{
			res.render("edit",{cmodel:foundModel});
		}
	})
});

router.put("/:id", middleware.checkOwnership, function(req,res){
	Model.findByIdAndUpdate(req.params.id, req.body.model,function(err, updatedModel){
		if(err)
		{
			req.flash("error","Something went wrong");
			console.log(err);
		}
		else{
			req.flash("success","Post updated successfully");
			res.redirect("/models/"+req.params.id);
		}
	})
})

//DELETE POST

router.delete("/:id",middleware.checkOwnership, function(req,res){
	Model.findByIdAndRemove(req.params.id, function(err){
		if(err)
		{
			req.flash("error","Something went wrong");
			console.log(err);
		}
		else
		{
			req.flash("success","Post deleted successfully");
			res.redirect("/models");
		}
	})
});


module.exports = router;