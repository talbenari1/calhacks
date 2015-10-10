'use strict';

let config = require('./config.json');
let app = require('express')();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

let server = app.listen(config.port, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Listening on port %s and address $(`);
});
