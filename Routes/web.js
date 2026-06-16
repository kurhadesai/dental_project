var express=require('express');
var router=express.Router();
var q=require('../db.js');

router.get('/',async(req,res)=>{
    var sql='select * from blog';
    var blog=await q(sql);

    var sql='select * from service';
    var service=await q(sql);
    res.render('web/index.ejs',{blog:blog,service:service});
})

router.post('/book_appointment',async(req,res)=>{
    var {name,email,service_id,appointment_date}=req.body;
    var sql='insert into appointment_enquiry(name,email,service_id,appointment_date,status) values(?,?,?,?,?)';
    var data=await q(sql,[name,email,service_id,appointment_date,'pending']);
    res.redirect('/');
})

router.get('/whyus',async(req,res)=>{
    var sql='select * from whyus';
    var why=await q(sql);
    res.render('web/whyus.ejs',{why:why});
})

router.get('/service',async(req,res)=>{
    var sql='select * from service';
    var service=await q(sql);
    res.render('web/service.ejs',{service:service});
})

router.get('/team',async(req,res)=>{
    var sql='select * from team';
    var team=await q(sql);
    res.render('web/team.ejs',{team:team});
})

router.get('/Pricing',async(req,res)=>{
    var sql='select * from pricing';
    var pricing=await q(sql);
    res.render('web/Pricing.ejs',{pricing:pricing});
})

router.get('/Dentalsolutions',async(req,res)=>{
    var sql='select * from dentalsolution';
    var data=await q(sql);
    res.render('web/Dentalsolutions.ejs',{data:data});
    // res.render('web/Dentalsolutions.ejs');
})

// router.get('/admin',(req,res)=>{
//     res.render('admin/index.ejs');
// })

module.exports=router;