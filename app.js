var express = require('express');
var app = express();
// app.set('port', process.env.PORT || 8080);
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var routes = require('./routes/index');
var port = process.env.PORT || 3000;

var mongo = require('mongodb').MongoClient;

server.listen(port);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

app.use('/', routes);

io.on('connection', function(socket){
	var CUSTOMCONNSTR_MONGOLAB_URI = 'mongodb://pioneer1625:95023680a@ds035617.mongolab.com:35617/stream-events';
	//-------------------------------------------------------------------------
	//USE BELOW WHEN TESTING LOCALLY
	//WHEN DONE TESTING COMMENT THIS OUT 
     mongo.connect(CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
         var collection = db.collection('chat_message_tester');
         var stream = collection.find().sort({ _id : -1 }).limit(10).stream();
         var stream = collection.find().sort().limit(10).stream();
			stream.on('data', function (chat) { 
				socket.emit('chat', chat.content); 
				console.log(chat.content);
			});
     });
    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    //USE AFTER DONE TESTING LOCALLY	
    //  mongo.connect(CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
    //      var collection = db.collection('chat_message');
    //      var stream = collection.find().sort({ _id : -1 }).limit(10).stream();
    //      var stream = collection.find().sort().limit(10).stream();
	// 		stream.on('data', function (chat) { 
			// 	socket.emit('chat', chat.content); 
			// 	console.log(chat.content);
			// });
    //  });
	//-------------------------------------------------------------------------
	socket.on('user joined', function(input){
		var usr = input[0];
        var time = input[1];
        var data = {
			user: usr,
    		time: time,
		}
		mongo.connect(CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
            var collection = db.collection('current_users');
            collection.insert(data, function (err, o) {
                if (err) { console.warn(err.message); }
                else { console.log(usr + " joined chat"); }
            });
        });
        io.emit('user joined', usr);
	});

	socket.on('chat message', function(input){
		var usr = input[0];
		var msg = input[1];
		var time = input[2];
		var data = {
			user: usr,
    		time: time,
    		content: msg
		}
	  //-------------------------------------------------------------------------
	  //USE BELOW WHEN TESTING LOCALLY
	  //WHEN DONE TESTING COMMENT THIS OUT 
		mongo.connect(CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
            var collection = db.collection('chat_messages_tester');
            collection.insert(data, function (err, o) {
                if (err) { console.warn(err.message); }
                else { console.log("chat message inserted into db: " + msg); }
            });
        });
      //------------------------------------------------------------------------- 

      //-------------------------------------------------------------------------
	  //USE AFTER DONE TESTING LOCALLY	
	  // mongo.connect(CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
      //     var collection = db.collection('chat_messages');
      //     collection.insert(data, function (err, o) {
      //         if (err) { console.warn(err.message); }
      //         else { console.log("chat message inserted into db: " + msg); }
      //     });
      // });
	  //-------------------------------------------------------------------------   
		io.emit('chat message', msg, usr);
	});

	socket.on('disconnect',function(){
		console.log("User disconnected");
	})
});

console.log("Conneted to: " + port);
