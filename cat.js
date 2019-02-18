var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat", { useNewUrlParser: true });

var catschema = new mongoose.Schema({
	name: String,
	age: Number
},{
	strict: false
});

var Cat = mongoose.model("Car",catschema);

var obj = new Cat({
	date: 23111997
});

obj.save(function(err,obj){
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log(obj);
	}
});

