var mysql=require('mysql2');
var util=require('util');

var conn=mysql.createConnection({
    host:'b9wisajnwpwzuwo5es8i-mysql.services.clever-cloud.com',
    user:'u0tvublduqwzhrup',
    password:'Ii3DsFesklf7pWjyvlAH',
    database:'b9wisajnwpwzuwo5es8i'
});

var exe=util.promisify(conn.query).bind(conn);


module.exports=exe;
