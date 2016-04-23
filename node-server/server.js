var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var db_conf = {host:'localhost',user:'jasonlamkk',password:'Abcd!234', database : 'fish2016'};
{
 var mytest = mysql.createConnection(db_conf);
 mytest.query("SELECT 1 FROM fish_pack", function(err){
  if(err){
	mytest.query("CREATE TABLE fish_pack (`p_id` VARCHAR(100) PRIMARY KEY , `json` TEXT, `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
  } 
});
 
}

var app = express();
app.use(express.static('fp'));
app.post('/sync', multipartMiddleware ,function(req, res){
///   res.writeHead(200, {'Content-Type': 'appliaction/json'});
//   console.log("Req : ", req);
var p = req.body['pid'];
var j = req.body['json'];
if(j && p && typeof p =='string' && p.length > 4 && j !== null ){
  var c = mysql.createConnection(db_conf);
  c.query("INSERT IGNORE INTO `fish_pack` (`p_id`, `json`) VALUES (?, ?) ",[p, j], function(err,result){
    if(!err){ 
console.log(req.files.fi);
	if(req.files && req.files.fi && req.files.fi.length > 0){
try{
		 console.log("Files : " , req.files.fi );
		if( ! fs.existsSync('fp' )){ fs.mkdirSync('fp') ; }
		var target = 'fp/fu/';
		if(!fs.existsSync(target)) fs.mkdirSync(target);
		var thumb  = 'fp/thumb/';
		if(!fs.existsSync(thumb)) fs.mkdirSync(thumb);
		target = target + p + "/";
		thumb = thumb + p + "/";
	        if(!fs.existsSync(target)) fs.mkdirSync(target);
		if(!fs.existsSync(thumb)) fs.mkdirSync(thumb);
		
		for(var i = 0; i<req.files.fi.length; i++){
			console.log("file - " , req.files.fi[i]);
        	    var src = req.files.fi[i];
            
            		fs.renameSync(src.path, target + src.name);
} }catch(ex){console.log('ex',ex); }		}
	
	console.log('done', result);
       res.send('1');
    } else {
	console.log('error', err);
       res.send('0');
    }
  });
} else {
	res.send('0');
}

});
app.get('/list-d',function(req,res){
	var c = mysql.createConnection(db_conf);
	c.query("SELECT * FROM `fish_pack` ", [], function(err,result){
		if(err){
			console.log(err);
		} else {
			console.log(result);
		}
		res.send('a');
	});
});
app.get('/qr',function(req,res) {
    var code = req.query.c;
    if(code && typeof code === 'string'){
        var c = mysql.createConnection(db_conf);
        c.query("SELECT json FROM `fish_pack` WHERE `p_id` = ? LIMIT 1 ", [code], function(err, result){
           if(err){
               res.send('{"error":"'+err+'"}');
           } else {
               var js = JSON.parse(result[0].json);
               fs.readdir('fp/fu/'+code+'/', function(err,list) {
                   if(err){
                       res.send(result[0].json);
                   }else {
                       js['images'] = list;
                       res.send(JSON.stringify(js));
                   }
               })
           }
        });
    }else{
        res.send('{"error":"no code"}');
    }
});


app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
