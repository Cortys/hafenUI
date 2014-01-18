/**
 * Module: main
 * Purpose: Main module for the main page
 * Author: Clemens Damke
 */

Modular.addModules({
	"logout": "main/logout.js",
});

new Modular("main", ["socketLimitatorFail", "logout"], function() {
    
});