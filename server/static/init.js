var swig = require("swig"),
	loggedIn = require("../core/loggedIn.js");

module.exports = function(express, app) {
	// Settings for HTML-rendering:
	app.engine("html", swig.renderFile);
	app.set("view engine", "html");
	app.set("views", "pages");
	app.set("view cache", false);
	
	// Make CSS, imgs and local-JS accessible:
	app.use(express.static(require("../core/settings.js").rootDir));
	
	app.get("/", function (req, res) {
		res.render(loggedIn(req)?"main":"login", {});
	});
	
	console.log("> Static page requests will be fetched");
};