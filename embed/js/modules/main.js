/**
 * Module: main
 * Purpose: Main module for the main page
 * Author: Clemens Damke
 */

Modular.addModules({
	"logout": "main/logout.js",
	"robotInformation": "main/robotInformation.js",
	"remote": "main/remote.js",
	"jobs": "main/jobs.js"
});

new Modular("main", ["socketLimitatorFail", "robotInformation", "logout", "jobs", "remote"], function() {
	
});