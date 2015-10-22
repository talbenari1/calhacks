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
      <div id="Index" className="main">
        <header><h1>CalHacks</h1></header>
        <div className="content">
          <div className="create-workspace">
            <button onClick={this.createWorkspace} className="create-new">Create a Workspace</button>
            <div className="create-or">OR</div>
            <input type="text" ref="joinUrl" className="join-url radius-left" placeholder="Join a Workspace" /><button onClick={this.joinWorkspace} className="join radius-right">Join</button>
            <div className="error">{this.state.errorMessage}</div>
          </div>
        </div>
      </div>
    );
  }
});

socket.on('respond-new-room', function(id) {
  history.pushState(null, '', id);

  ReactDOM.render(
    <Workspace name={id}/>,
    document.getElementById('render')
  );
});

if (location.pathname === '/') {
  ReactDOM.render(
    <Index />,
    document.getElementById('render')
  );
}
