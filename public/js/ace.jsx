var channel = 'ace';
var sendChange = true;

window.AceModule = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  getData: function() {
    return this.ace.getValue();
  },
  isEmpty: function() {
    return !this.getData().length;
  },
  setData: function(data) {
    sendChange = false;
    this.ace.setValue(data);
    sendChange = true;
  },
  update: function(data) {
    this.setData(data); // TODO: make betterer
  },
  onChange: function() {
    if (sendChange) {
      var value = this.ace.getValue();

      room.emit('send-change', {
        channel: channel,
        data: value
      });
    }
  },
  componentDidMount: function() {
    ace.config.set('packaged', true);
    this.ace = ace.edit('AceEditor');
    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/');
    this.ace.setStyle('ace-style');
    this.ace.setTheme('tomorrow');
    this.ace.getSession().setUseWorker(false);
    this.ace.getSession().setMode('javascript');
    this.ace.on('change', this.onChange);
    
    room.emit('join-channel', channel);
  },
  render: function() {
    modules[channel] = this;

    return (
      <div id="AceEditor">this is a test</div>
    )
  }
});
