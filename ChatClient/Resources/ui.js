var LIGHT_GRAY = '#D3D3D3',
	BLACK = '#000';

function createMessageView(args) {
	var view = Ti.UI.createView(args);
	var scrollView = Ti.UI.createScrollView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		layout: 'vertical'
	});
	
	view.add(scrollView);
	
	function addMessage(m) {
		var mv = createMessageView(m);
		scrollView.add(mv.view);
		scrollView.scrollToBottom();
	}
	
	function createMessageView(args) {
		var mView = Ti.UI.createView({
			top: 2,
			bottom: 2,
			left: 5,
			right: 5,
			backgroundColor: LIGHT_GRAY,
			height: Ti.UI.SIZE,
			borderRadius: 8
		});
		
		var user = Ti.UI.createLabel({
			top: 0,
			left: 5,
			color: BLACK,
			text: args.user
		});
		
		var message = Ti.UI.createLabel({
			top: 0,
			right: 5,
			color: BLACK,
			text: args.text
		});
		
		mView.add(user);
		mView.add(message);
		
		return {
			view: mView
		};
	}
	
	return {
		view: view,
		addMessage: addMessage
	};
}

function createSendView(args) {
	var view = Ti.UI.createView(args);
	var textField = Ti.UI.createTextField({
		left: 5,
		right: '20%',
		top: 5,
		bottom: 5,
		color: BLACK,
		hintText: 'Message'
	});
	var sendButton = Ti.UI.createButton({
		left: '82%',
		top: 5,
		right: 5,
		bottom: 5,
		title: 'Send',
		borderRadius: 8,
		backgroundColor: LIGHT_GRAY
	});
	
	textField.addEventListener('change', function() {
		if (textField.value && textField.value.length > 0) {
			sendButton.backgroundColor = 'green';
		} else {
			sendButton.backgroundColor = LIGHT_GRAY;
		}
	});
	textField.addEventListener('return', send);
	sendButton.addEventListener('click', send);
	
	function send() {
		if (args.onSend && textField.value && textField.value.length > 0) {
			var result = args.onSend({
				text: textField.value
			});
			if (result) {
				sendButton.backgroundColor = LIGHT_GRAY;
				textField.value = '';
			}
		}
	}
	
	view.add(textField);
	view.add(sendButton);
	
	return {
		view: view
	};
}

exports.createMessageView = createMessageView;
exports.createSendView = createSendView;
