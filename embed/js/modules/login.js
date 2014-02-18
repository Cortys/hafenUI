/**
 * Module: login
 * Purpose: Main module for the login page
 * Author: Clemens Damke
 */

Modular.addModules({
	"list": "login/list.js",
	"connect": "login/connect.js"
});

new Modular("login", ["events", "socketLimitatorFail","list","connect"], function(d) {
	socketLimitator.do.onSuccess(function() {
		// Assumes, that #wrap is hidden by default and has to be shown, after loading robots:
		list.do.load(function() {
			login.do.show();
		});
		
		connect.do.onConnect(function() {
			login.do.hide(function() {
				location.reload();
			});

		});
		connect.do.onFail(function() {
			login.do.fail();
		});
	});
});

login.do = {
	interval: null,
	show: function() {
		$("#wrap").show().unbind(events.transitionEnd).attr("class", "animated fadeInDown");
	},
	hide: function(callback) {
		$("#wrap").attr("class", "animated fadeOutUp").unbind(events.transitionEnd).one(events.transitionEnd, callback || function() {});
	},
	fail: function() {
		$("#wrap").attr("class", "animated wobble").one(events.transitionEnd, function() {
			$("#wrap").removeAttr("class");
		});
	}
};