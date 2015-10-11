var channel = 'chat';

var ChatList = React.createClass({
  render: function() {
    var messages = this.props.messages.map(function (message) {
      return (
        <div>
          <div className="text">{message.text}</div>
          <div className="info">
            <span className="author">{message.author === username ? 'You' : message.author}</span>
            <span className="time">{message.time}</span>
          </div>
        </div>
      );
    });

    return (
      <div className="chatList">
        {messages}
      </div>
    );
  }
});

var ChatNameRequest = React.createClass({
  handleUsernameSet: function() {
    var username = this.refs.input.value.trim();
    if(!username) {
      return;
    }

    this.props.onConfirm({username: username});
  },
  render: function() {
    return (
      <div>
        <label>
          Enter a username:
          <input type="text" onKeyDown={this.handleReturnKey} ref="input" />
          <button onClick={this.handleSend}>Confirm</button>
        </label>
      </div>
    );
  }
})

var ChatInput = React.createClass({
  handleSend: function() {
    var author = room.id;
    var text = this.refs.message.value.trim();

    if (!text) {
      return;
    }

    this.props.onSend({author: author, text: text, time: Date.now()});
    this.refs.message.value = '';
  },
  handleReturnKey: function(e) {
    if (e.which === 13) {
      this.handleSend();
    }
  },
  render: function() {
    return (
      <div className="chatInput">
        <input type="text" onKeyDown={this.handleReturnKey} placeholder="Message..." ref="message" />
        <button onClick={this.handleSend} ref="send">Send</button>
      </div>
    );
  }
});

window.Chat = React.createClass({
  hasUsername: false,
  getInitialState: function() {
    return {messages: []};
  },
  handleUsernameSet: function(username) {
    modules.config.data.usernames[room.id] = username;
    this.hasUsername = true;
  },
  handleChatSend: function(message) {
    this.state.messages.push(message);
    this.setState(this.state);

    room.emit('send-change', {
      channel: channel,
      data: message
    });
  },
  getData: function() {
    return this.state.messages;
  },
  isEmpty: function() {
    return !this.state.messages.length;
  },
  setData: function(data) {
    this.state.messages = data;
    this.setState(this.state);
  },
  update: function(data) {
    if (this.state.messages.length) {
      for (var i = this.state.messages.length - 1; i >= 0; i--) {
        console.log(this.state.messages[i], data);
        if (this.state.messages[i].time < data.time) {
          this.state.messages.splice(i + 1, 0, data);
          break;
        }
      }
    } else {
      this.state.messages.push(data);
    }

    this.setState(this.state);
  },
  componentDidMount: function() {
    room.emit('join-channel', channel);
  },
  render: function() {
    modules[channel] = this;

    return (
      <div id="Chat">
        <ChatList messages={this.state.messages} />
        <ChatNameRequest onConfirm={this.handleUsernameSet} />
        <ChatInput onSend={this.handleChatSend} style={{display: this.hasUsername}} />
      </div>
    );
  }
});
