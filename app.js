var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Model = require("./models/model");
var seedDb = require("./seeds.js");
var Comment = require("./models/comments")
var passport = require("passport")
var localStrategy = require("passport-local")
var User = require("./models/user")
var flash = require("connect-flash")
var methodOverride = require("method-override")
var middleware = require("./middleware/index")
var commentRoutes = require("./routes/comments")
var modelRoutes = require("./routes/models")
var indexRoutes = require("./routes/index")



 mongoose.connect("mongodb://localhost/kawaiOnna", { useNewUrlParser: true });

app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");



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


app.use(indexRoutes);
app.use("/models",modelRoutes);
app.use("/models/:id/comments",commentRoutes);




//search posts
app.get("/searchpost",function(req,res){
	var searchQuery = String(req.query.squery);
	searchQuery = searchQuery.toLowerCase();
	//console.log(typeof searchQuery);
	var filteredModels = []
	Model.find({},function(err,models)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					//console.log(models);	
					models.forEach(function(model){
						var tmp = String(model.name);
						tmp = tmp.toLowerCase();
						if(tmp.indexOf(searchQuery)!=-1)
						{
							filteredModels.push(model);
						}
					})
					if(filteredModels.length==0)
						res.render("noresults");
					else
						res.render("filtered-models",{models:filteredModels,searchQuery:searchQuery});
				}
			});
	//res.send("working");
})



app.listen(3000,function(){
	console.log("Server started");
});

