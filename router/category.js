const Router=require('express').Router;
const CategoryModel=require('../models/category.js');
const pagination=require('../util/pagination.js');
const router=Router();

//权限控制
router.use((req,res,next)=>{
    if(req.userInfo.isAdmin){
        next()
    }else{
        res.send('<h1>请用管理员账号登录</h1>');
    }
})

//显示分类管理页面
router.get("/",(req,res)=>{
    
    let options = {
        page: req.query.page,//需要显示的页码
        model:CategoryModel, //操作的数据模型
        query:{}, //查询条件
        projection:'_id name order', //投影，
        sort:{order:1} //排序
    }

    pagination(options)
    .then((data)=>{
        res.render('admin/category_list',{
            userInfo:req.userInfo,
            categories:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:'/category'
        });     
    })
})

//显示新增页面
router.get("/add",(req,res)=>{
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
})
//处理添加请求
router.post("/add",(req,res)=>{
    let body = req.body;
    // console.log('body::',body)
    CategoryModel
    .findOne({name:body.name})
    .then((cate)=>{
        if(cate){//已经存在渲染错误页面
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'新增分类失败,已有同名分类'
            })
        }else{
            new CategoryModel({
                name:body.name,
                order:body.order
            })
            .save()
            .then((newCate)=>{
                if(newCate){//新增成功,渲染成功页面
                    res.render('admin/success',{
                        userInfo:req.userInfo,
                        message:'新增分类成功',
                        url:'/category'
                    })
                }
            })
            .catch((e)=>{//新增失败,渲染错误页面
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'新增分类失败,数据库操作失败'
                })
            })
        }
    })
})
router.get('/edit/:id',(req,res)=>{
    let id=req.params.id;   
    CategoryModel.findById({_id:id})
    .then((category)=>{
        res.render('admin/category_edit',{
            userInfo:req.userInfo,
            category:category
        });
    })
      
})
router.post('/edit/:id',(req,res)=>{
    let id=req.params.id;
    let body=req.body;

    /*
    CategoryModel.findOne({name:body.name})
    .then((category)=>{
        if(category && body.order==category.order){
            res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'编辑分类失败,数据已有'
            }) 
        }else{
            CategoryModel.update({_id:id},{name:body.name,order:body.order},(err,category)=>{
                if(!err){
                    res.render('admin/success',{
                        userInfo:req.userInfo,
                        message:'编辑分类成功',
                        url:'/category'
                    })                        
                }else{
                    res.render('admin/error',{
                        userInfo:req.userInfo,
                        message:'编辑分类失败,数据库操作失败'
                    })      
                }
            })
        }
    })
    */
    CategoryModel.findById(id)
    .then((category)=>{
        if(category.name==body.name && category.order==body.order){
            res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'请修改后提交'
            })
        }else{
            CategoryModel.findOne({name:body.name,_id:{$ne:id}})
            .then((category)=>{
                if(category){
                    res.render('admin/error',{
                            userInfo:req.userInfo,
                            message:'编辑分类失败,数据已有'
                    }) 
                }else{
                    CategoryModel.update({_id:id},{name:body.name,order:body.order},(err,category)=>{
                        if(!err){
                            res.render('admin/success',{
                                userInfo:req.userInfo,
                                message:'编辑分类成功',
                                url:'/category'
                            })                        
                        }else{
                            res.render('admin/error',{
                                userInfo:req.userInfo,
                                message:'编辑分类失败,数据库操作失败'
                            })      
                        }
                    })
                }
            })
        }
    })   
})
router.get('/delete/:id',(req,res)=>{
    let id=req.params.id;
    CategoryModel.remove({_id:id},(err,sew)=>{
        if(!err){
          res.render('admin/success',{
                userInfo:req.userInfo,
                message:'删除分类成功',
                url:'/category'
            })  
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'删除分类失败,数据库操作失败'
            })     
        }
    })
})
module.exports=router;