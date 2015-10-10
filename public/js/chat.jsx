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
    render: function() {
      return (
        <div className="chatInput">
          <input type="text" placeholder="Message..." ref="message" />
          <button onClick={this.handleSend}>Send</button>
        </div>
      );
    }
});

window.Chat = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleChatSend: function(data) {
    this.state.data.push(data);
    this.setState(this.state);
  },
  render: function() {
    room.emit('join-channel', 'chat');
    modules.chat = this;
    return (
      <div>
        <ChatList messages={this.state.data}/>
        <ChatInput onSend={this.handleChatSend}/>
      </div>
    );
  }
});

// room.emit('join-channel', 'chat');

