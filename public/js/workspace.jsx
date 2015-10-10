room = io(location.href);

window.Workspace = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Workspace</h1>
        <Chat/>
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

room.on('request-data', function(channel) {
  room.emit('respond-data', {
    channel: channel,
    data: chat
  });
});

room.on('respond-data', function(data) {
  console.log(data);
});
