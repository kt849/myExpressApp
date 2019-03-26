var Model = require("../models/model.js");
var Comment = require("../models/comments.js")


var middlewareObj = {};

middlewareObj.isLoggedIn  = function(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	req.flash("error","Please login first");
	res.redirect("/login")
}

middlewareObj.checkOwnership =  function (req,res,next){
	if(req.isAuthenticated())
	{
		Model.findById(req.params.id, function(err,foundModel){
			if(err)
			{
				req.flash("error","Something went wrong");
				res.redirect("back");
			}
			else
			{
				if(foundModel.author.id.equals(req.user._id))
				{
					next();
				}
				else
				{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","Please Login first");
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership  = function (req,res,next){
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.cid, function(err,foundComment){
			if(err)
			{
				req.flash("error","Something went wrong");
				res.redirect("back");
			}
			else
			{
				if(foundComment.author.id.equals(req.user._id))
				{
					next();
				}
				else
				{
					req.flash("error","you don't have the required permission");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","Please Login first");
		res.redirect("back");
	}
}


module.exports = middlewareObj;