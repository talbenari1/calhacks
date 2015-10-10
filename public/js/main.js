/* jshint browser: true, esnext: true */
/* globals io */
'use strict';

var socket = io(location.origin);
var room = null;

socket.on('respond-new-room',function(id) {
  location.pathname = id;
});

document.getElementById('create').addEventListener('click', function() {
  socket.emit('request-new-room');
}, false);

if (location.pathname !== '/') {
  room = io(location.href);
  room.emit('join-channel', 'chat');

  room.on('respond-data', function(data) {
    console.log(data);
  });

  room.on('request-data', function(channel) {
    room.emit('respond-data', {
      channel: channel,
      value: document.getElementById('input').value || ''
    });
  });
}
