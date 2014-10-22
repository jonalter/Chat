module.exports = function(Message) {

    Message.hello = function(msg, cb) {
      cb(null, 'Hi there... ' + msg);
    }

    Message.remoteMethod(
        'hello', 
        {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
        }
    );

};
