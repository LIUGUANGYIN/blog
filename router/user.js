const Router=require('express').Router;
const Model=require('../models/model.js');
const hmac=require('../util/hmac.js')

const router=Router();

router.post("/register",(req,res)=>{
    let body=req.body;
    let result={
    	code:0,
    	message:'',
    }
    Model
    .findOne({username:body.username})
    .then((user)=>{
    	if(user){
    		result.code=10,
    	    result.errmessage='用户已存在',
    	    res.json(result);
    	}else{
    		new Model({
    			username:body.username,
    			password:hmac(body.password),
    		})
    		.save((err,newuser)=>{
    			if(!err){ 
    				res.json(result);
    			}else{
    				code=10,
    	            message='注册失败',
    	            res.json(result);
    			}
    		})
    	}
    })
})

router.post("/login",(req,res)=>{
    let body=req.body;
    let result={
    	code:0,
    	message:''
    } 
    
    Model
    .findOne({username:body.username,password:hmac(body.password)})

    .then((user)=>{
    	if(user){

    		req.session.userInfo={
    			_id:user._id,
    			username:user.username,
    			isAdmin:user.isAdmin
    		}
    		// req.cookies.set('userInfo',JSON.stringify(result.data));
    	    res.json(result);
    	}else{
			result.code=10,
            result.message='注册失败'
            res.json(result);
    	}
    })
})
//退出
router.get('/logout',(req,res)=>{
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}	
	// req.cookies.set('userInfo',null);
    req.session.destroy();
	res.json(result);

})
module.exports=router;