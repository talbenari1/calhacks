window.Index = React.createClass({
  createWorkspace: function () {
    socket.emit('request-new-room');
  },
  joinWorkspace: function() {
    var id = this.refs.joinUrl.value.trim();

    room = io(location.origin + '/' + id);

    room.on('connect', function() {
      history.pushState(null, '', id);
      ReactDOM.render(
        <Workspace name={id}/>,
        document.getElementById('main')
      );
    });

    room.on('error', error => {
      if (error = "Invalid Namespace") {
        room = null;
        this.state.errorMessage = 'Invalid workspace';
        this.setState(this.state);
      }
    });
  },
  getInitialState() {
      return {
          errorMessage: ''  
      };
  },
  render: function() {
    return (
      <div id="Index">
        <header><h1>CalHacks</h1></header>
        <div className="buttons">
          <button onClick={this.createWorkspace}>Create Workspace</button>
          <div className="or">Or</div>
          <div className="joinSection">
            <input type="text" ref="joinUrl" /><button onClick={this.joinWorkspace}>Join Workspace</button>
          </div>
          <div className="error">{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
});

socket.on('respond-new-room', function(id) {
  history.pushState(null, '', id);

  ReactDOM.render(
    <Workspace name={id}/>,
    document.getElementById('main')
  );
});

if (location.pathname === '/') {
  ReactDOM.render(
    <Index />,
    document.getElementById('main')
  );
}
