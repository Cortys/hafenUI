/**
 * BFP - Bluetooth file protocol
 * Handle bluetooth connections via the filesystem
 */

module.exports = {
	operations: {
		connect: "c",
		disconnect: "d",
		send: "s",
		receive: "r",
        kill: "k"
	},
	createRobotKey: function(target) {
		return target.toString("hex");
	},
	encode: function(id, operation, data) {
		if(!id || (!operation && id != this.operations.kill))
			return "";
		return id+(operation?":"+operation:"")+(data?":"+data:"")+"\n";
	},
	decode: function(line) {
		var parts = line.trim().split(":", 3);
		if(!parts[0] || !parts[1])
			return null;
		return {
			key: parts[0],
			operation: parts[1],
			data: parts[2]?parts[2]:null
		};
	}
};