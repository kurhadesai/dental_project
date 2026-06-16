var express=require('express');
var router=express.Router();
var q=require('../db.js');
var path=require('path');


var router=express.Router();
var fs = require('fs');

function Check_l_details(req,res,next){
    if(req.session.lid){
        next();
    }else{
        res.redirect('/admin');
    }
}

// // local session data store sathi 
// router.use((req,res,next)=>{
//     res.locals.session=req.session;
    //    next();
// })

router.get('/',async(req,res)=>{
    var sql='select * from login';
    var data=await q(sql);
    // res.send(data);
    
    res.render('admin/login.ejs');
})

router.post('/login_check',async(req,res)=>{
    var {username,password}=req.body;
    var sql='select * from login where username=? and password=?';
    var data=await q(sql,[username,password]);
    if(data[0]){
        req.session.lid=data[0].lid;
        req.session.admin_name=data[0].admin_name;
        res.redirect('/admin/index');
    }else{
        // res.send('Not Found');
        res.redirect('/admin/');
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy();  
    res.redirect('/admin/');
})

router.get('/forgot',(req,res)=>{
    res.render('admin/forgot.ejs');
})

router.get('/index',Check_l_details,(req,res)=>{
    res.render('admin/index.ejs');
})

router.get('/users',(req,res)=>{
    res.render('admin/users.ejs');
})

router.get('/Dentalsolutions',async(req,res)=>{
    var sql='select * from dentalsolution';
    var data=await q(sql);
    res.render('admin/Dentalsolutions.ejs',{data:data});
})

router.post('/Dentalsolutions_save',async(req,res)=>{
    // res.send(req.body);
    var {title,desc}=req.body;
    var sql='insert into dentalsolution(title,description)values(?,?)';
    var data=await q(sql,[title,desc]);
    // res.send(data);
    res.redirect('/admin/Dentalsolutions');

})

router.get('/Dentalsolutions_delete/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='delete from dentalsolution where ds_id=?';
    var data=await q(sql,[id]);
    res.redirect('/admin/Dentalsolutions');
})  

router.get('/Dentalsolutions_edit/:id',async(req,res)=>{
    id=req.params.id;
    var sql='select * from dentalsolution where ds_id=?';
    var data=await q(sql,[id]);
    res.render('admin/Dentalsolutions_edit.ejs',{data:data[0]});
})

router.post('/Dentalsolutions_edit_save/:id',async(req,res)=>{
     // res.send(req.body);
    var id=req.params.id;
    var {title,desc}=req.body;
    var sql='update dentalsolution set title=?,description=? where ds_id=?';
    var data=await q(sql,[title,desc,id]);
    // res.send(data);
    res.redirect('/admin/Dentalsolutions');

})

router.get('/Blog',async(req,res)=>{
    var sql='select * from blog';
    var data=await q(sql);
    res.render('admin/Blog.ejs',{data:data});
})

router.post('/Blog_save',async(req,res)=>{
    // res.send(req.body);
       var {bdate,btitle,bdesc}=req.body;
    // res.send(req.files);
    var fname=Date.now()+req.files.bphoto.name;
    var uploadpath=path.join(__dirname,'../public/admin/images',fname);
    req.files.bphoto.mv(uploadpath);
    // res.send(uploadpath);
    var sql='insert into blog (bdate,btitle,bdesc,bphoto) values(?,?,?,?)';
    var data=await q(sql,[bdate,btitle,bdesc,fname]);
    // res.send(data);
    res.redirect('/admin/Blog');
})

router.get('/Blog_delete/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;
    var imgpath=path.join(__dirname,'../public/admin/images',img);
    fs.unlink(imgpath,(err)=>{});
    var sql='delete from blog where bid=?';
    var data=await q(sql,[id]);
    res.redirect('/admin/Blog');
});

router.get('/Blog_edit/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='select * from blog where bid=?';
    var data=await q(sql,[id]);
    res.render('admin/Blog_edit.ejs',{data:data[0]});
});

router.post('/Blog_edit_save/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;
    var {bdate,btitle,bdesc}=req.body;
    
    var dateObj = new Date(bdate);
    var year = dateObj.getFullYear();
    var month = String(dateObj.getMonth() + 1).padStart(2, '0');
    var day = String(dateObj.getDate()).padStart(2, '0');
    bdate = year + '-' + month + '-' + day;
    
    var newimg = img;
    if(req.files && req.files.bphoto){
        newimg = Date.now()+req.files.bphoto.name;
        var uploadpath=path.join(__dirname,'../public/admin/images',newimg);;
        await req.files.bphoto.mv(uploadpath);
        var imgpath=path.join(__dirname,'../public/admin/images',img);
        fs.unlink(imgpath,(err)=>{});
    }
    var sql='update blog set bdate=?,btitle=?,bdesc=?,bphoto=? where bid=?';
    var data=await q(sql,[bdate,btitle,bdesc,newimg,id]);
    res.redirect('/admin/Blog');
});

router.get('/Whyus',async(req,res)=>{
    var sql='select * from whyus';
    var data=await q(sql);
    res.render('admin/Whyus.ejs',{data:data});
})

router.post('/Whyus_save',async(req,res)=>{
    var {btitle,bdesc}=req.body;

    var fname=Date.now()+req.files.bphoto.name;
    var uploadpath=path.join(__dirname,'../public/admin/images',fname);

    req.files.bphoto.mv(uploadpath);

    var sql='insert into whyus (btitle,bdesc,bphoto) values(?,?,?)';
    var data=await q(sql,[btitle,bdesc,fname]);

    res.redirect('/admin/Whyus');
})

router.get('/Whyus_delete/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;

    var imgpath=path.join(__dirname,'../public/admin/images',img);

    fs.unlink(imgpath,(err)=>{});

    var sql='delete from whyus where wid=?';
    var data=await q(sql,[id]);

    res.redirect('/admin/Whyus');
});

router.get('/Whyus_edit/:id',async(req,res)=>{
    var id=req.params.id;

    var sql='select * from whyus where wid=?';
    var data=await q(sql,[id]);

    res.render('admin/Whyus_edit.ejs',{data:data[0]});
});

router.post('/Whyus_edit_save/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;

    var {btitle,bdesc}=req.body;

    var newimg=img;

    if(req.files && req.files.bphoto){
        newimg=Date.now()+req.files.bphoto.name;

        var uploadpath=path.join(__dirname,'../public/admin/images',newimg);

        await req.files.bphoto.mv(uploadpath);

        var imgpath=path.join(__dirname,'../public/admin/images',img);

        fs.unlink(imgpath,(err)=>{});
    }

    var sql='update whyus set btitle=?,bdesc=?,bphoto=? where wid=?';
    var data=await q(sql,[btitle,bdesc,newimg,id]);

    res.redirect('/admin/Whyus');
});

router.get('/service',async(req, res) => {
    var sql = 'select * from service';
    var service = await q(sql);

    res.render('admin/service.ejs',{service:service});
});

router.post('/service_save',async(req, res) => {
    var { stitle, sdesc } = req.body;

    var sql = 'insert into service(stitle,sdesc) values(?,?)';
    await q(sql, [stitle, sdesc]);

    res.redirect('/admin/service');
});

router.get('/service_delete/:id', async (req, res) => {
    var id = req.params.id;

    var sql = 'delete from service where sid=?';
    await q(sql, [id]);

    res.redirect('/admin/service');
});

router.get('/service_edit/:id',async(req, res)=>{
    var id = req.params.id;

    var sql = 'select * from service where sid=?';
    var data = await q(sql, [id]);

    res.render('admin/service_edit.ejs',{data: data[0]});
});

router.post('/service_edit_save/:id', async (req, res) => {
    var id = req.params.id;
    var { stitle, sdesc } = req.body;

    var sql = 'update service set stitle=?, sdesc=? where sid=?';
    await q(sql, [stitle, sdesc, id]);

    res.redirect('/admin/service');
});

router.get('/team',async(req,res)=>{
    var sql = 'select * from team';
    var team = await q(sql);

    res.render('admin/team.ejs',{team:team});
});

router.post('/team_save',async(req,res)=>{
    var {ttitle,tdesc} =req.body;

    var sql = 'insert into team(ttitle,tdesc) values(?,?)';
    await q(sql, [ttitle,tdesc]);

    res.redirect('/admin/team');
});

router.get('/team_delete/:id',async(req,res)=>{
    var id=req.params.id;

    var sql='delete from team where tid=?';
    await q(sql,[id]);

    res.redirect('/admin/team');
});

router.get('/team_edit/:id', async (req, res) => {
    var id = req.params.id;

    var sql = 'select * from team where tid=?';
    var data = await q(sql, [id]);

    res.render('admin/team_edit.ejs', { data: data[0] });
});

router.post('/team_edit_save/:id',async(req,res)=>{
    var id=req.params.id;
    var {ttitle,tdesc}=req.body;

    var sql='update team set ttitle=?,tdesc=? where tid=?';
    await q(sql,[ttitle,tdesc,id]);

    res.redirect('/admin/team');
});

router.get('/Pricing', async (req, res) => {
    var sql = 'select * from pricing';
    var pricing = await q(sql);

    res.render('admin/Pricing.ejs', { pricing: pricing });
});

router.post('/Pricing_save', async (req, res) => {
    var {
        ptitle,
        psubtitle,
        pprice,
        pfeature1,
        pfeature2,
        pfeature3,
        pfeature4
    } = req.body;

    var sql = `insert into pricing
    (ptitle,psubtitle,pprice,pfeature1,pfeature2,pfeature3,pfeature4)
    values(?,?,?,?,?,?,?)`;

    await q(sql, [
        ptitle,
        psubtitle,
        pprice,
        pfeature1,
        pfeature2,
        pfeature3,
        pfeature4
    ]);

    res.redirect('/admin/Pricing');
});

router.get('/Pricing_delete/:id', async (req, res) => {
    var id = req.params.id;

    var sql = 'delete from pricing where pid=?';
    await q(sql, [id]);

    res.redirect('/admin/Pricing');
});

router.get('/Pricing_edit/:id', async (req, res) => {
    var id = req.params.id;

    var sql = 'select * from pricing where pid=?';
    var data = await q(sql, [id]);

    res.render('admin/Pricing_edit.ejs', { data: data[0] });
});

router.post('/Pricing_edit_save/:id', async (req, res) => {
    var id = req.params.id;

    var {
        ptitle,
        psubtitle,
        pprice,
        pfeature1,
        pfeature2,
        pfeature3,
        pfeature4
    } = req.body;

    var sql = `update pricing set
    ptitle=?,
    psubtitle=?,
    pprice=?,
    pfeature1=?,
    pfeature2=?,
    pfeature3=?,
    pfeature4=?
    where pid=?`;

    await q(sql, [
        ptitle,
        psubtitle,
        pprice,
        pfeature1,
        pfeature2,
        pfeature3,
        pfeature4,
        id
    ]);

    res.redirect('/admin/Pricing');
});

router.get('/appointment_pending',async(req,res)=>{
    var sql='select * from appointment_enquiry where status=?';
    var data=await q(sql,['pending']);
    res.render('admin/appointment_pending.ejs',{data:data});
})

router.get('/appointment_confirm/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update appointment_enquiry set status=? where aid=?';
    var data=await q(sql,['confirm',id]);
    res.redirect('/admin/appointment_pending');
})
router.get('/appointment_reject/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update appointment_enquiry set status=? where aid=?';
    var data=await q(sql,['reject',id]);
    res.redirect('/admin/appointment_pending');
})

router.get('/appointment_confirm',async(req,res)=>{
    var sql='select * from appointment_enquiry where status=?';
    var data=await q(sql,['confirm']);
    res.render('admin/appointment_confirm.ejs',{data:data});
})

router.get('/appointment_reject',async(req,res)=>{
    var sql='select * from appointment_enquiry where status=?';
    var data=await q(sql,['reject']);
    res.render('admin/appointment_reject.ejs',{data:data});
})

router.get('/appointment_search',async(req,res)=>{
    // res.send(req.query);
    var from_date=req.query.from_date;
    var to_date=req.query.to_date;
    var status=req.query.status;
    var sql='select * from appointment_enquiry where appointment_date>=? and appointment_date<=? and status=?';
    var data=await q(sql,[from_date,to_date,status]);
    // res.send(data);
    res.render('admin/appointment_pending.ejs',{data:data});
})

module.exports=router;