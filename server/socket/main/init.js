module.exports = function(socket) {
	socket.on("disconnect", require("./disconnect.js"));
}