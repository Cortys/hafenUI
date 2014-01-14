var connections = require("../core/connections.js");

module.exports = function(socket) {
    socket.on("alreadyConnected", function(data, callback) {
        callback(!client || client.socket === socket);
    });
};