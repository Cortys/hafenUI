/**
 * Module: main
 * Purpose: Main module for the main page
 * Author: Clemens Damke
 */

Modular.addModules({
	"logout": "main/logout.js",
	"robotInformation": "main/robotInformation.js",
	"remote": "main/remote.js", // not used right now
	"jobs": "main/jobs.js",
	"map": "main/map.js"
});

new Modular("main", ["socketLimitatorFail", "robotInformation", "logout", "jobs", "map"], function() {
	
});