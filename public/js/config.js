var Config = {
  data: {
    usernames: {},
    name: null,
  },
  getData: function() {
    return this.data;
  },
  setData: function(data) {
    this.data = data;
  },
  update: function(data) {
    if (data.name) {
      this.data.name = data.name;
    }
    if (data.usernames) {
      for (prop in data.usernames) {
        if (data.hasOwnProperty(prop)) {
          this.data.usernames[prop] = data.usernames[prop];
        }
      }
    }
  },
  isEmpty: function() {
    return this.data.names === null &&
           Object.keys(this.data.usernames).length === 0;
  }
};
