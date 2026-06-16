var express = require('express');
var app = express();
var session = require('express-session');
var fileUpload=require('express-fileupload');


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());
app.use(session({
    secret:'mysecretkey',
    resave:false,
    saveUninitialized:true
}))

var web = require('./Routes/web.js');
var admin = require('./Routes/admin.js');


app.use('/', web);
app.use('/admin', admin);

app.listen(3000);