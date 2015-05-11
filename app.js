var express = require('express');  // includes express module
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var http = require('http');  // includes http module
var app = express();  //  it instantiates Express and assigns our app variable to it. 
var port = 3000;  // port set to 3000 on which http server will listen.

var server = http.createServer(app);  //  it invokes createServer function to start a basic HTTP server and server is linked to the express object.
var sio = require('socket.io').listen(server); //includes socket.io module and attach it to the http server.

var clients = {};  // object to hold clients' nicknames.
var noOfClients = 0; // object to hold the number of clients.

server.listen(port); // server asked to listen on the specified port.

//tasks to be performed on receiving connection request.
sio.sockets.on('connection', function(socket){

    // on getting message from a client/user, server emits the nickname and the message to all the other clients/users listening on the port.
    socket.on('sendMsg', function(msg){
        sio.sockets.emit('update', {
            nickName: socket.nickName,
            message: msg
        });
    })

    // when a new client/user joins the chat by providing nickname, he is added to the client object.
    socket.on('newUser', function(nickName){
        socket.nickName = nickName;
        clients[nickName] = nickName;
        noOfClients++;
    });
    
    // on disconnect request, the client/user is removed.
    socket.on('disconnect', function(){
        delete clients[socket.nickName];
        noOfClients--;
    })
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
