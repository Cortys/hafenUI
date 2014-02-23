/**
 * RCP - Robot Control Protocol
 * Contol a container managing robot around the map and handle answers
 */

module.exports = {
	operations: {
		idle: "n",
		forward: "r",
		right: "r",
		left: "l",
		turn: "t",
		init: "i",
		status: "s",
		position: "p",
		getContainer: "a",
		putContainer: "d"
	},
	encode: function(operation, id) {
		if(operation !== this.operations.getContainer)
			return operation;
		return id?operation+","+id:"";
	},
	decode: function(line) {
		if(typeof line != "string")
			return null;
		var parts = line.trim().split(",", 3);
		if(!parts[0])
			return null;
		return {
			operation: parts[0],
			data: (parts[0]==this.operations.status?!!(parts[1]*1):{
				current: parts[1],
				last: parts[2]
			})
		};
	}
};