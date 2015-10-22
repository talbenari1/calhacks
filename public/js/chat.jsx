var channel = 'chat';

var ChatList = React.createClass({
  render: function() {

    var messages = this.props.messages.map(message => {
      var isMe = message.author === this.props.username;
      var msgClasses = 'message';

      if (isMe) {
        msgClasses += ' me';
      }

      return (
        <div key={message.author + message.time} className={msgClasses}>
          <div className="text">{message.text}</div>
          <div className="info">
            <span className="author">
              {isMe ? 'You' : message.author}
            </span> • <span className="time">{moment(message.time).format('lll')}</span>
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
    if (!username) {
      return;
    }
    
    for (var id in modules.config.data.usernames) {
      if (modules.config.data.usernames.hasOwnProperty(id) && username === modules.config.data.usernames[id]) {
        return;
      }
    }

    this.props.onConfirm(username);
  },
  handleReturnKey: function(e) {
    if (e.which === 13) {
      this.handleUsernameSet();
    }
  },
  render: function() {
    return (
      <div className="chatUsername">
        <label>
          Choose a username to join the chat:
          <span className="username">
            <input type="text" onKeyDown={this.handleReturnKey} ref="input" className="radius-left"/>
            <button onClick={this.handleUsernameSet} className="radius-right">Confirm</button>
          </span>
        </label>
      </div>
    );
  }
})

var ChatInput = React.createClass({
  handleSend: function() {
    var text = this.refs.message.value.trim();

    if (!text) {
      return;
    }

    this.props.onSend({text: text, time: Date.now()});
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
        <button onClick={this.handleSend} ref="send" className="radius-none">Send</button>
        <input type="text" onKeyDown={this.handleReturnKey} placeholder="Message..." ref="message" className="radius-none"/>
      </div>
    );
  }
});

window.Chat = React.createClass({
  getInitialState: function() {
    return {
      messages: [],
      username: null
    };
  },
  handleUsernameSet: function(username) {
    modules.config.data.usernames[room.id] = username;
    this.state.username = username;
    this.setState(this.state);
  },
  handleChatSend: function(message) {
    message.author = this.state.username;

    room.emit('send-change', {
      channel: channel,
      data: message
    });

    this.state.messages.push(message);
    this.setState(this.state);
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
        <ChatList messages={this.state.messages} username={this.state.username}/>
        {this.state.username ?
          <ChatInput onSend={this.handleChatSend} /> :
          <ChatNameRequest onConfirm={this.handleUsernameSet} />}
      </div>
    );
  }
});
