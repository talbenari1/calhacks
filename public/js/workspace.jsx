window.Workspace = React.createClass({
  componentWillMount: function() {
    room = io(location.href);
  },
  componentDidMount: function() {
    room.on('request-data', function(channel) {
      console.log('Request to force update');
      if (modules[channel] && !modules[channel].isEmpty()) {
        room.emit('respond-data', {
          channel: channel,
          data: modules[channel].getData()
        });
      }
    });

    room.on('respond-data', function(data) {
      console.log(data);

      modules[data.channel].setData(data.data);
    });

    room.on('receive-change', function(change) {
      modules[change.channel].update(change.data);
    });
  },
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
