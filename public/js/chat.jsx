var channel = 'chat';

var ChatList = React.createClass({
  render: function() {
    var messages = this.props.messages.map(function (message) {
      return (
        <div>
          <div className="text">{message.text}</div>
          <div className="info">
            <span className="author">{message.author}</span>
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

var ChatInput = React.createClass({
  handleSend: function() {
      var author = room.id;
      var text = this.refs.message.value.trim();

      if (!text) {
        return;
      }

      this.props.onSend({author: author, text: text, time: Date.now()});
      this.refs.message.value = '';

      return;
    },
    handelReturnKey: function(e) {
      if (e.which === 13) {
        this.handleSend();
      }
    },
    render: function() {
      return (
        <div className="chatInput">
          <input type="text" onKeyDown={this.handelReturnKey} placeholder="Message..." ref="message" />
          <button onClick={this.handleSend} ref="send">Send</button>
        </div>
      );
    }
});

window.Chat = React.createClass({
  getInitialState: function() {
    return {messages: []};
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
      <div>
        <ChatList messages={this.state.messages}/>
        <ChatInput onSend={this.handleChatSend}/>
      </div>
    );
  }
});
