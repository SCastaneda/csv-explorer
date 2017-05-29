// socket is used to display the upload progress
var socket = io('http://localhost:' + port);

var bar = $('.progress-bar');
var percent = $('.percent');

socket.on('progress', function (data) {
    console.log(data);
    var percentVal = data.progress + '%';
    bar.width(percentVal);
    percent.html(percentVal);
});

socket.on('complete', function (data) {
    console.log("File processing complete");
    var percentVal = '100%';
    bar.width(percentVal);
    percent.html(percentVal);
});

socket.on('getSession', function(data) {
  socket.emit('session', { "session": session });
});

socket.on('setSession', function(data) {
  session = data.session;
  window.location.hash = session;
});

function reconnect() {
  if(!socket.connected) {
    socket.connect();
  }
}