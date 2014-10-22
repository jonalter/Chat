var UI = require('ui'),
	Net = require('net');
var lastId = 0,
	intervalId,
	paused = false;


var win = Ti.UI.createWindow({
	backgroundColor: '#FFF'
});

var nameField = Ti.UI.createTextField({
	top: 15,
	height: 40,
	left: 5,
	right: 5,
	color: '#000',
	suppressReturn: true,
	hintText: 'User name'
});

var messageView = UI.createMessageView({
	top: 60,
	bottom: 45
});

var sendView = UI.createSendView({
	height: 45,
	bottom: 0,
	backgroundColor: '#FFF',
	onSend: function(e) {
		if (!nameField.value || nameField.value.length < 1) {
			alert('User name required');
			return false;
		}
		sendMessage(e);
		return true;
	}
});


win.add(nameField);
win.add(messageView.view);
win.add(sendView.view);

Ti.App.addEventListener('keyboardframechanged', function(e) {
	messageView.view.bottom = e.keyboardFrame.height + sendView.view.height;
	sendView.view.bottom = e.keyboardFrame.height;
});
Ti.App.addEventListener('pause', function() {
	clearInterval(intervalId);
	paused = true;
});
Ti.App.addEventListener('resume', function() {
	if (!paused) {
		return;
	}
	intervalId = setInterval(getMessages, 3000);
	paused = false;
});

win.addEventListener('open', function() {
	intervalId = setInterval(getMessages, 3000);
});
win.addEventListener('close', function() {
	clearInterval(intervalId);
});

win.open();

function getMessages() {
	Net.getMessages({
		lastId: lastId
	}, function(e) {
		console.log('## RECeived: ' + e);
		addMessages(e);
	});
}

function sendMessage(e) {
	Ti.API.info('Sending: ' + e.text);
	
	// messageView.addMessage({
	// 	user: nameField.value,
	// 	text: e.text
	// });
	
	Net.sendMessage({
		data: {
		  "user": nameField.value,
		  "text": e.text
		}
	}, function(e) {
		console.log('RESPONSE: ' + e);
	});
}

function addMessages(msgs) {
	msgs = msgs || [];
	for (var i = 0, j = msgs.length; i < j; i++) {
		var msg = msgs[i];
		if (msg.id === lastId) {
			return;
		}
		console.log('Adding: ' + JSON.stringify(msg));
		messageView.addMessage({
			user: msg.user,
			text: msg.text
		});
		// Keep track of the last message received to
		// avoid pulling all messages every time.
		if (msg.id > lastId) {
			lastId = msg.id;
		}
	}
}
