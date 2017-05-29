// socket is used to display the upload progress
var socket = io('http://localhost:' + port);

var bar = $('.progress-bar');
var percent = $('.percent');

socket.on('progress', function (data) {
    console.log(data);
    var percentVal = data.progress + '%';
    bar.width(percentVal);
    percent.html(percentVal);
    $('#uploadButton').prop('disabled', true);
    $('#uploadButton').val('Upload in progress');
});

socket.on('complete', function (data) {
    console.log("File processing complete");
    var percentVal = '100%';
    bar.width(percentVal);
    percent.html(percentVal);
    $('#uploadButton').prop('disabled', false);
    $('#uploadButton').html('Upload');
});

function reconnect() {
  if(!socket.connected) {
    socket.connect();
  }
}