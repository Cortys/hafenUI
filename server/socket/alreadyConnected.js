var connections = require("../core/connections.js");

module.exports = function(socket) {
    var client = connections.getClient(socket),
        v = !(client && client.socket && socket.id != client.socket.id && !client.socket.disconnected && !socket.disconnected);
    socket.emit("alreadyConnected", { isUnconnected:v });
    return v;
};