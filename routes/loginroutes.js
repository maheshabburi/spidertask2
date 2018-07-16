var mysql      = require('mysql');
var express = require("express");
var app = express();
var deferred = require("deferred");
var bcrypt = require("bcrypt");
//var popupS = require("popups");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port : '8080',
  database : 'mahi',
  multipleStatements : true
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn" + err);
}
});

exports.signup = function(req,res){
  console.log("req",req.body);
  //res.render('signup');
  //app.set('view engine','pug');
//app.set('views','./views');
  var today = new Date();
  bcrypt.hash(req.body.password, 10, function(err, hash) {
  // Store hash in database
  if (err) throw err;
 // global.hashed=hash;
  var users={
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "password":hash,
    "created":today,
    "modified":today
  }
  var email1 = req.body.email + "note";
   connection.query(' CREATE TABLE ?? (`id` int(11) NOT NULL AUTO_INCREMENT,`title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,`note` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ',email1,function(err,result){
  	if(err) throw err;
  });
  connection.query(' CREATE TABLE ?? (`id` int(11) NOT NULL AUTO_INCREMENT,`email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,`created` datetime NOT NULL,`modified` datetime NOT NULL,`list` varchar(255) NOT NULL,`chec_k` varchar(20) NOT NULL, PRIMARY KEY (`id`)) ',[req.body.email],function(err,result){
  	if(err) throw err;
  });
  
  connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
   // console.log('The solution is: ', results);
    res.render("onlylogin");
  }
  });
  });
}

app.set('view engine','pug');
app.set('views','./views');



exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, result, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
    }else{
    	
     //console.log('The solution is: ', result[0]);
    if(result.length >0){
    	var sess = req.session;  //initialize session variable
		req.session.userId = result[0].email; //set user id
		req.session.user = result;//set user name
    	//console.log(result[0].password);
    	bcrypt.compare(password,result[0].password, function(err,resp){
    		console.log(result[0].password,result[0].password);
      if(resp){
      	var mytodolist = [];
      	connection.query(" SELECT * FROM ?? WHERE email='"+email+"'  ",[email],function(error,results,fields){
      		console.log('results');
			//if(results.length > 0){
			//var id = result[0].id ;
			for(i=0;i<results.length;i++){
			var todo = {
				'id':results[i].id,
				'list':results[i].list,
				'check' : results[i].chec_k
			}
                  mytodolist.push(todo);
		}
			//console.log(results.length);	
			//mytodolist.push(results);
			//console.log(mytodolist);
				//console.log(rows[0].list);
				//res.write('<li>'+results[0].list+'</li>');
		res.render('todo2',{'mytodolist':mytodolist});
	            
	   // }	
	    		});
      	//res.render('todo2',{mytodolist:result});
      //	for(i=1;i<10;i++){
	//	connection.query(" SELECT * FROM usertodo WHERE email='"+email+"' AND id='"+i+"' ",function(error,result,fields){
	//	console.log(result.length);	
		//	if(result.length > 0){
		//		console.log(result[0].list);
		//res.render('todo2',{mytodo:result});
	    
	  //  }	
	   // 		});
	//}
      	//res.render('todo2',{mytodo:result});
      	//app.set('view engine','pug');
        //app.set('views','./views');
        
      }
      else{
        res.render('signagain');
      }
      });
    }
    else{
      res.render('signagain');
    }
  }
  });
}

exports.todo = function(req,res){
	console.log('inside todo');
	var email= req.session.userId;
	
	var today = new Date();
	var i;
	var mytodolist=[];
	
	//console.log(list);
	if(req.body.input!="")
	{var list = req.body.input;
		var usertodo={
		"email":email,
		"list":list,
		"created":today,
		"modified":today,
		"chec_k":'notchecked'
	};
	connection.query(" INSERT INTO "+ email +" SET ? ",usertodo,function(err){
		if(err) throw err;
	});
		connection.query(" SELECT id FROM ?? ",[email],function(error,result){
		//console.log(result);
		//res.writeHead(200, {'Content-Type': 'html'});
	   // res.write(' <form method="POST" action="/added"> ');
   // res.write('   <div id="myDIV" class="header"> ');
   // res.write("        <h2>My To Do List</h2> ");
   // res.write('<input type="text", id="myInput", placeholder="Title...">');
   // res.write('        <button type= "submit" onclick="newElement()" class="addBtn">Add</button> ');
    // res.write("   </div> ");
    // res.write(" </form>");
		//for(i=result[0].id;i<result[0].id + result.length;i++){
			//if(i<result[0].id + result.length){
		connection.query(" SELECT * FROM ?? WHERE email='"+email+"'  ",[email],function(error,results,fields){
			if(results.length > 0){
			//var id = result[0].id ;
			for(i=0;i<results.length;i++){
			var todo = {
				id : results[i].id,
				list : results[i].list,
				check : results[i].chec_k
			}
                  mytodolist.push(todo);
		}
			//console.log(results.length);	
			//mytodolist.push(results);
			//console.log(mytodolist);
				//console.log(rows[0].list);
				//res.write('<li>'+results[0].list+'</li>');
		res.render('todo2',{'mytodolist':mytodolist});
	            
	    }	
	    		});
	//}
	 //else
	 	//res.end();
	//}
	//res.end();
		});
}
else
 {
connection.query(" SELECT id FROM ?? ",[email],function(error,result){
		//console.log(result);
		//res.writeHead(200, {'Content-Type': 'html'});
	   // res.write(' <form method="POST" action="/added"> ');
   // res.write('   <div id="myDIV" class="header"> ');
   // res.write("        <h2>My To Do List</h2> ");
   // res.write('<input type="text", id="myInput", placeholder="Title...">');
   // res.write('        <button type= "submit" onclick="newElement()" class="addBtn">Add</button> ');
    // res.write("   </div> ");
    // res.write(" </form>");
		//for(i=result[0].id;i<result[0].id + result.length;i++){
			//if(i<result[0].id + result.length){
		connection.query(" SELECT * FROM ?? WHERE email='"+email+"'  ",[email],function(error,results,fields){
			if(results.length > 0){
			//var id = result[0].id ;
			for(i=0;i<results.length;i++){
			var todo = {
				id : results[i].id,
				list : results[i].list,
				check : results[i].chec_k
			}
                  mytodolist.push(todo);
		}
			//console.log(results.length);	
			//mytodolist.push(results);
			//console.log(mytodolist);
				//console.log(rows[0].list);
				//res.write('<li>'+results[0].list+'</li>');
		res.render('todo2',{'mytodolist':mytodolist});
	            
	    }	
	    		});
	});
 }
	
}


exports.signout = function(req,res){
	var mytodolist=[];
	var email= req.session.userId;
	var i;
	connection.query(" SELECT * FROM ?? WHERE email='"+email+"'  ",[email],function(error,results,fields){
			if(results.length > 0){
			//var id = result[0].id ;
			for(i=0;i<results.length;i++){
			var todo = {
				id : results[i].id,
				list : results[i].list,
				check : results[i].chec_k
			}
                  mytodolist.push(todo);
		}
			//console.log(results.length);	
			//mytodolist.push(results);
			//console.log(mytodolist);
				//console.log(rows[0].list);
				//res.write('<li>'+results[0].list+'</li>');
				 var valuelist=[];
		for(i=1;i<=mytodolist.length;i++)
		{
			//console.log("Hi");
			name='do'+i;
			console.log(name);
	        var status=req.body[name];
	        console.log(status);

            var values={
            	
            	chec_k:status,
            	id:i
            }
	       valuelist.push(values);
}
//console.log(valuelist);
 //if(status=='checked'){
	        	var queries='';
	        	valuelist.forEach(function(item){
	        		queries+= mysql.format( "UPDATE"+email+" SET chec_k=? WHERE id=?",item);
	        	});
	        	//connection.query(queries, deferred.makeNodeResolver());
	        	connection.query(queries, function(res,err){
	        		console.log(values);
	        		if (err) throw err;
	        		console.log("in");
	        	});
	    		
	//console.log(mytodolist);
	
	res.render('homepage');
}
});
}

exports.addnote = function(req,res){
	email = req.session.userId + "note";
	var mynotelist = [];
	console.log(email);
	 connection.query(" SELECT * FROM ?? ",email,function(error,results,fields){
	 	console.log(results);
	 	//if(results){
      for(i=0;i<results.length;i++){
			var note = {
				id : results[i].id,
				title : results[i].title,
				note : results[i].note
			}
                  mynotelist.push(note);
		}
			//console.log(results.length);	
			//mytodolist.push(results);
			//console.log(mytodolist);
				//console.log(rows[0].list);
				//res.write('<li>'+results[0].list+'</li>');
		res.render('note',{'mynotelist':mynotelist});
	        // }  
	       //  else{
	        // 	console.log("hi");
	         // res.render('note'); 
	     // }
	 });

}

exports.addingnote = function(req,res){
	var email = req.session.userId + "note";
	console.log(email);
	var mynotelist=[];
	var values={
		title: req.body.title,
		note: req.body.note
	}
	
	 connection.query(" INSERT INTO "+ email +" SET ? ",values,function(err){
		if(err) throw err;
	});
	 connection.query(" SELECT * FROM ?? ",[email],function(error,results,fields){
      for(i=0;i<results.length;i++){
			var note = {
				id : results[i].id,
				title : results[i].title,
				note : results[i].note
			}
                  mynotelist.push(note);
		}
			//console.log(results.length);	
			//mytodolist.push(results);
			//console.log(mytodolist);
				//console.log(rows[0].list);
				//res.write('<li>'+results[0].list+'</li>');
		res.render('note',{'mynotelist':mynotelist});
	            
	 });
}

exports.signedout = function(req,res){
	res.render('homepage');
}