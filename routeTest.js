var RouteCalculator = require("./server/core/control/routeCalculator.js"),

	rc = new RouteCalculator(1);

rc.calculate(2, 5, 8, function(path) {
	console.log(path);
});