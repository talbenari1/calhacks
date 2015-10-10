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
      id = crypto.randomBytes(6).toString('base64');
    } while (rooms.has(id));

    // Create a namespace for the workspace
    let nsp = io.of(id);

    nsp.on('connection', socket => {
      let flags = rooms.get(id).flags;
      // Adding a new module
      socket.on('join-channel', channel => {
        if (!flags[channel]) {
          socket.to(channel).emit('request-data');
          flags[channel] = true;
        }
      });
      socket.on('respond-data', data => {
        if (flags[channel]) {
          socket.to(channel).emit('respond-data', data);
          flags[channel] = false;
        }
      });
    });

    rooms.set(id, {nsp, flags: {}});
    socket.emit('respond-new-room', id);
  });
});

app.get('/:id', (req, res) => {
  let id = req.params.id;
  if (rooms.has(id)) {
    // Successful connection to a room
    res.send(`Connected to room ${id}`);
  } else {
    // Room doesn't exist
    res.sendFile('public/404.html');
  }
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
