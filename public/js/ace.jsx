var channel = 'ace';

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
    this.ace.setValue(data);
  },
  update: function(data) {
    this.setData(data); // TODO: make betterer
  },
  componentDidMount: function() {
    this.ace = ace.edit('AceEditor');
    room.emit('join-channel', channel);
  },
  render: function() {
    modules[channel] = this;

    return (
      <div id="AceEditor"></div>
    )
  }
});
