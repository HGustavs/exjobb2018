var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mysql = require('mysql');
var app = express();

// -------------------------
// Settings for migration
// -------------------------

router.get('/', function(req, res, next) {
    res.render('settings', { settingsSet: false });
});

router.post('/', function(req, res, next) {
    
    // Mysql
    req.app.locals.mysql_host = req.body.mysql_host;
    req.app.locals.mysql_user = req.body.mysql_user;
    req.app.locals.mysql_pw = req.body.mysql_pw;
    req.app.locals.mysql_db = req.body.mysql_db;
    
    // Keystone
    // making the connection string 
    req.app.locals.keystone = "mongoDB://" + req.body.keystone_host + ":" + req.body.keystone_port + "/" + req.body.keystone_db;
    
    // log it
    console.log(req.app.locals.mysql_db);
    console.log(req.app.locals.keystone);
    
    // test connections
    var validateMySQL;
    var validateKeystone;
    
    // mysql
    var testCon = mysql.createConnection({
        host: req.app.locals.mysql_host,
        user: req.app.locals.mysql_user,
        password: req.app.locals.mysql_pw,
        database: req.app.locals.mysql_db
    });
    
    if(testCon.connect()){
        validateMySQL = true;
    } else {
        validateMySQL = false;
    }
    
    testCon.close();
    
    // mongo
    var testKeystoneCon = mongoose.connection;
    testKeystoneCon.connect(req.app.locals.keystone, function(err){
        if(err){
            validateKeystone = false;
        }else{
            validateKeystone = true;
        }
    });
    
    testKeystoneCon.close();
    
    // render it 
    if(validateKeystone && validateMySQL){
        res.render('settings', { settingsSet: true, error: false });
    } else {
        res.render('settings', { settingsSet: true, error: true })
    }
});

module.exports = router;
