window.Index = React.createClass({
  handleClick: function () {
    socket.emit('request-new-room');
  },
  render: function() {
    return (
      <div>
        <h1>CalHacks</h1>
        <button onClick={this.handleClick}>Create Workspace</button>
      </div>
    );
  }
});

socket.on('respond-new-room', function(id) {
  history.pushState(null, '', id);
  document.title = 'Workspace ' + id;

  ReactDOM.render(
    <Workspace name={id}/>,
    document.getElementById('index')
  );
});

if (location.pathname === '/') {
  ReactDOM.render(
    React.createFactory(Index)(null),
    document.getElementById('index')
  );
}
