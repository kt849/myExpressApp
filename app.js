var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Model = require("./models/model");
var seedDb = require("./seeds.js");
var Comment = require("./models/comments.js")
var passport = require("passport")
var localStrategy = require("passport-local")
var User = require("./models/user.js")
var flash = require("connect-flash")
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/kawaiOnna", { useNewUrlParser: true });

app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//seedDb();

// //set schema
// var modelsSchema = new mongoose.Schema({
// 	name: String,
// 	image: String,
// 	description: String
// });

// var Model = mongoose.model("Model", modelsSchema);

/*model.create({
		name:"Shraddha Kapoor",
		image:"https://m.media-amazon.com/images/M/MV5BMTU1NzU2Nzk0MV5BMl5BanBnXkFtZTgwMzIzMzg4MjE@._V1_UX140_CR0,0,140,209_AL_.jpg"
},function(err, model){
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log(model);
	}
});
*/


// Passport config
app.use(require("express-session")({
	secret: "kawai Alia",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.cUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.get('/', function (req, res) {
	res.render("root"); 
});


app.get("/models",function(req, res) {
	
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

app.post("/models",isLoggedIn,function(req,res) {
	console.log("Post request sent");
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

app.get("/models/new",isLoggedIn, function(req,res){
	res.render("new");
});

app.get("/models/:id",function(req,res){
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



app.get("/models/:id/comments/new",isLoggedIn, function(req,res){
	Model.findById(req.params.id,function(err,model){
		if(err)
			console.log(err);
		else
		{
			res.render("newcomment",{model:model});
		}
	});

});

app.post("/models/:id/comments",isLoggedIn,function(req,res){
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


// auth routes

app.get("/register",function(req,res)
{
	res.render("register");
});

app.post("/register",function(req,res){
		User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err)
		{
			req.flash("error",err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to kawaiOnna "+ req.body.username);
			res.redirect("/models");
		});
	});
});

app.get("/login",function(req,res){

	res.render("login");
});

app.get("/successfullLogin",function(req,res){
		req.flash("success","Welcome "+req.user.username);
		res.redirect("/models");

})
app.post("/login",passport.authenticate("local",
	{
		successRedirect: "/successfullLogin",
		failureRedirect: "/login",
		failureFlash: true
	}),function(req,res){
		
});

app.get("/logout",function(req,res){
		req.logout();
		req.flash("success","Logged out Successfully");
		res.redirect("/login");
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	req.flash("error","Please login first");
	res.redirect("/login")
}


//Update

app.get("/models/:id/edit", checkOwnership, function(req,res){
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

app.put("/models/:id", checkOwnership, function(req,res){
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

//DELETE

app.delete("/models/:id",checkOwnership, function(req,res){
	Model.findByIdAndRemove(req.params.id, function(err){
		if(err)
		{
			req.flash("error","Something went wrong");
			console.log(err);
		}
		else
		{
			req.flash("success","Comment deleted");
			res.redirect("/models");
		}
	})
});

function checkOwnership(req,res,next){
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


// edit comments

app.get("/models/:id/comments/:cid/edit", checkCommentOwnership, function(req,res){
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

app.put("/models/:id/comments/:cid", checkCommentOwnership, function(req,res){
	console.log(req.body.comment.author);
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
app.delete("/models/:id/comments/:cid/delete",checkCommentOwnership, function(req,res){
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


function checkCommentOwnership(req,res,next){
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

app.listen(3000,function(){
	console.log("Server started");
});

