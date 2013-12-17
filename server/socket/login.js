var connectRobot = require("./connectRobot.js");

module.exports = function(socket) {
	connectRobot.newSocket(socket); // currently only connectRobot's features are available for login-socket-users
}