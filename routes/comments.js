
var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware/index.js")
var Model = require("../models/model.js");
var Comment = require("../models/comments.js")



//New comment 
router.get("/new",middleware.isLoggedIn, function(req,res){
	Model.findById(req.params.id,function(err,model){
		if(err)
			console.log(err);
		else
		{
			res.render("newcomment",{model:model});
		}
	});

});


//Create a new comment
router.post("/",middleware.isLoggedIn,function(req,res){
	Model.findById(req.params.id,function(err,model){
		if(err)
		{
			req.flash("error","Something went wrong");
			console.log(err);
			res.redirect("/models");
		}
		else
		{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
				{
					console.log(err);
					req.flash("error","Something went wrong");
					res.redirect("/models");
				}
				else
				{

					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					model.comments.push(comment);
					model.save();
					req.flash("success","Comment created successfully");
					res.redirect("/models/"+req.params.id);
				}
			});
		}
	});
});


//Edit a comment page
router.get("/:cid/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.cid,function(err,comment){
		if(err)
		{
			req.flash("error","Something went wrong");
			res.redirect("back");
		}
		else
		{
			res.render("editComment",{comment:comment,m_id:req.params.id});
		}
	});
});


//Updating a comment
router.put("/:cid", middleware.checkCommentOwnership, function(req,res){
	//console.log(req.body.comment.author);
	Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err){
		if(err)
		{
			req.flash("error","Something went wrong");
			res.redirect("back");
		}
		else
		{
			req.flash("success","edited successfully");
			res.redirect("/models/"+req.params.id);
		}
	})
})


//delete comments
router.delete("/:cid/delete",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.cid,function(err){
		if(err)
		{
			req.flash("error","Something went wrong");
			res.redirect("back");
		}
		else
		{
			req.flash("success","Deleted successfully");
			res.redirect("/models/"+req.params.id);
		}
	})
})

module.exports = router;