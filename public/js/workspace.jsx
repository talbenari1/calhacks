var room = io(location.href);
var chat = {
  value: 'asfg'
};

window.Workspace = React.createClass({
  render: function() {
    room.emit('join-channel', 'chat');

    room.on('request-data', function(channel) {
      room.emit('respond-data', {
        channel: channel,
        data: chat
      });
    });

    room.on('respond-data', function(data) {
      console.log(data);
    });
    
    return (
      <div>
        <h1>Workspace</h1>
      </div>
    );
  }
});

if (location.pathname !== '/') {
  ReactDOM.render(
    React.createFactory(Workspace)(null),
    document.getElementById('index')
  );
}

