var server_name = "http://127.0.0.1:3000/"; // name of the server.
var socket = io.connect(server_name);  // socket io instance.

// when the client establishes a connection with the server, he is asked for his nickname which is sent to server and is registered. 
socket.on('connect', function(){
	var nickName = prompt("Give yourself a nick.");
	while(nickName==null || nickName.length == 0){
          nickName = prompt("Give yourself a nick.");
	}    
	socket.emit('newUser', nickName);
});

// when the client receives update request from the server, it updates the chat box with the message sent from the user.
socket.on('update', function(data){
	$("#chatBox").append('<b>' + data.nickName + ': </b>' + data.message + '<br>');
});

// this is used to handle the event when the user presses the "enter" button after writing some text in the input box.
$(window).keydown(function(event){
	// condition to check if key pressed is "Enter" key.
	if(event.which === 13){
		// on keypress event sendMessage is called.
		sendMessage();
	}
});

// this function takes the text written in the input box and sends it to server.
function sendMessage(){
	var msg = $("#inputMsg").val();
	if(msg){
		$("#inputMsg").val('');
		socket.emit('sendMsg', msg);
	}
}
