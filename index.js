'use strict';

let config = require('./config.json'); // our configuration object
let express = require('express');
let app = express(); // the application itself
let server = require('http').Server(app);
let io = require('socket.io')(server);
let crypto = require('crypto');
let rooms = new Map();

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('request-new-room', () => {
    // Create a unique ID for the user
    let id;

    do {
      id = crypto.randomBytes(6).toString('hex');
    } while (rooms.has(id));

    console.log(id);

    // Create a namespace for the workspace
    let nsp = io.of(id);

    nsp.on('connection', socket => {
      let flags = rooms.get(id).flags;
      // Adding a new module
      socket.on('join-channel', channel => {
        console.log('Req to join', socket.id);
        socket.join('chat', function() {
          if (!flags[channel]) {
            socket.broadcast.to(channel).emit('request-data', channel);
            flags[channel] = true;
          }
        });
      });
    });

    nsp.on('respond-data', data => {
      let flags = rooms.get(id).flags;

      if (flags[data.channel]) {
        socket.to(data.channel).emit('respond-data', data);
        flags[data.channel] = false;
      }
    });

    rooms.set(id, {
      nsp, flags: {}
    });
    socket.emit('respond-new-room', id);
  });
});

app.get('/:id', (req, res) => {
  let id = req.params.id;
  if (rooms.has(id)) {
    console.log('found', id);
    // Successful connection to a room
    res.sendFile(__dirname + '/public/index.html');
  } else {
    // Room doesn't exist
    res.sendFile(__dirname + '/public/404.html');
  }
});

server.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
