var channel = 'config';

var Config = {
  data: {    
    usernames: {},
    name: null,
  },
  getData: function() {
    return this.data;
  },
  isEmpty: function() {
    return this.data.names === null &&
           Object.keys(this.data.usernames).length === 0;
  }
 };

room.emit('join-channel', channel);

