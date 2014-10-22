// var baseUrl = 'http://192.168.1.175:3000/api/Messages';
var baseUrl = 'http://ancient-coast-8421.herokuapp.com:80/api/Messages';

function getMessages(args,cb) {
	
	ServerCall({
		requestUrl: baseUrl + '?filter=' + encodeURIComponent('{"where":{"id":{"gt":'+args.lastId+'}}}')
	}, cb);
}

function sendMessage(args,cb) {
	
	ServerCall({
		verb: 'POST',
		data: args.data,
		requestUrl: baseUrl
	}, cb);
}

exports.getMessages = getMessages;
exports.sendMessage = sendMessage;


// ----------------- server function -----------------
function ServerCall(params,callback,progress){
	var requestUrl = params.requestUrl;
	var passthrough = params.passthrough;
	var verb = params.verb || 'GET';
	
	var xhr = Ti.Network.createHTTPClient();

	var timeOut = params.timeout || 20000;
	xhr.setTimeout(timeOut);

	xhr.onload = function(){
		Ti.API.info('XHR: onload()');
		try{
			Ti.API.info(this.responseText);
			var json = JSON.parse(this.responseText);
			
			if(json){
				callback(json, passthrough);
			}else{
				Ti.API.error(' - - - - - - - 1 - - - - - - - -');
				callback();
			}
		}catch(e){
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			Ti.API.error(' - - - - - - - 2 - - - - - - - -');
			xhr = null;
			callback();
		}
	};

	xhr.onerror = function(e){
		Ti.API.info('XHR: onerror()');
		Ti.API.error(e.error);
		Ti.API.error(this.responseText);
		Ti.API.error(' - - - - - - - 3 - - - - - - - -');
		xhr = null;
	};
	if(progress){
		xhr.ondatastream = function(e){
			progress(e.progress);
		};
	}
	
	Ti.API.info('XHR: requestUrl '+requestUrl);

	xhr.open(verb, requestUrl);

	if (Ti.Network.online == true){	
		xhr.send(params.data);
	} else {
		callback();
	}
}