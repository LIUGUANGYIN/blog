const mongoose = require('mongoose');

const userschema=new mongoose.Schema({
	username:String,
	password:String,
	isAdmin:{
		type:Boolean,
		default:false
	}

});
Model=mongoose.model('User',userschema);

module.exports=Model;