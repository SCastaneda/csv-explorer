// socket is used to display the upload progress
var socket = io('http://localhost:' + port);

var bar = $('.progress-bar');
var percent = $('.percent');

socket.on('progress', function (data) {
    console.log(data);
    var percentVal = data.progress + '%';
    bar.width(percentVal)
    percent.html(percentVal);
});

socket.on('complete', function (data) {
    console.log("File processing complete");
    var percentVal = '100%';
    bar.width(percentVal)
    percent.html(percentVal);
});

function reconnect() {
  socket.connect();
}