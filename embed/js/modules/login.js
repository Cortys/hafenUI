/**
 * Module: login
 * Purpose: Main module for the login page
 * Author: Clemens Damke
 */

Modular.addModules({
	"list": "login/list.js",
	"connect": "login/connect.js"
});

new Modular("login", ["socketLimitatorFail","list","connect"], function(d) {
	socketLimitator.do.onSuccess(function() {
		// Assumes, that #wrap is hidden by default and has to be shown, after loading robots:
		list.do.load(function() {
			login.do.show();
		});
		
		connect.do.onConnect(function() {
			login.do.hide();
			setTimeout(function() {
				location.reload();
			}, 1000);
		});
		connect.do.onFail(function() {
			login.do.fail();
		});
	});
});

login.do = {
	interval: null,
	show: function() {
		clearInterval(this.interval);
		$("#wrap").show().attr("class", "animated fadeInDown");
	},
	hide: function() {
		clearInterval(this.interval);
		$("#wrap").attr("class", "animated fadeOutUp");
	},
	fail: function() {
		if(this.interval)
			clearInterval(this.interval);
		$("#wrap").attr("class", "animated wobble");
		this.interval = setTimeout(function() {
			$("#wrap").removeAttr("class");
		}, 1000);
	}
};