var mongoose = require("mongoose");
var Model = require("./models/model");
var Users = require("./models/user");
var Comment = require("./models/comments");
var models=[
	{
		name: "Alia Bhatt",
		image: "https://m.media-amazon.com/images/M/MV5BMTczMzY3Nzk5MV5BMl5BanBnXkFtZTgwMjIyMDU0OTE@._V1_UX140_CR0,0,140,209_AL_.jpg",
		description: "She is one of cutest actresses in Bollywood"
	},
	{
		name: "Aditi Rao Hydari",
		image: "https://m.media-amazon.com/images/M/MV5BMTY3OTc3NTg2OV5BMl5BanBnXkFtZTgwMjkzMDY3NTE@._V1_UY209_CR17,0,140,209_AL_.jpg",
		description: "She is one of prettiest actresses in Bollywood"
	}

]

function seedDb()
{
	Users.remove({},function(err){});
	Comment.remove({},function(err){});
	Model.remove({},function(err){
	// 	if(err)
	// 	{
	// 		console.log(err);
	// 	}
	// 	console.log("removed everything");

	// 	models.forEach(function(seed){
	// 		Model.create(seed,function(err,model){
	// 			if(err)
	// 			{
	// 				console.log(err);
	// 			}
	// 			else
	// 			{
	// 				console.log("added model");
	// 				Comment.create({
	// 					text: "She is so cute <3<3<3",
	// 					author: "Everyone"
	// 				},function(err,comment){
	// 					if(err)
	// 					{
	// 						console.log(err);
	// 					}
	// 					else
	// 					{
	// 						model.comments.push(comment);
	// 						model.save();
	// 						console.log("Created new comment");
	// 					}
	// 				});

	// 			}
	// 		});
	// 	});

	 });

}


module.exports = seedDb;