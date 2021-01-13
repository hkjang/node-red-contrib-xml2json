var xml2json = require('xml2json');

module.exports = function (RED) {
  function xml2jsonFunction(config) {
    RED.nodes.createNode(this, config);
    var self = this;
    this.on('input', function(msg) {
      msg.payload =  xml2json.toJson(msg.payload);
      self.send(msg);
    });
  }
  RED.nodes.registerType('xml2json', xml2jsonFunction);
};
