/**
 * Module: socket
 * Purpose: Establish and handle socket connections
 * Author: Clemens Damke
 */

new Modular("socket", ["ajaxBar"], function() {
	this.do.setup();
});

socket.val = {
	port: null, // null = Same port used for socket and static content
	socket: null,
	waiting: [],
	timeout: 30000
};

socket.do = {
	val: socket.val,
	setup: function(loggedIn) {
		var t = this;
		
		t.val.socket = io.connect("http://"+(t.val.port?location.hostname+":"+t.val.port:location.host)+"/"+(loggedIn?"main":"login"));
		t.val.socket.on("connect", function() {
			for (var i = 0; i < t.val.waiting.length; i++)
				t.val.waiting[i]();
			t.val.waiting = [];
			ajaxBar.hide();
		});
		t.val.socket.on("disconnect", function() {
			ajaxBar.error();
		});
	},
	send: function(type, obj, callback) {
		var t = this;
		t.ready(function() {
			if(callback) {
				ajaxBar.show();
				var timer = setTimeout(function() {
					callback();
					callback = function() {};
					ajaxBar.error();
				}, t.val.timeout);
			}
			t.val.socket.emit(type, obj, callback?function() {
				clearTimeout(timer);
				ajaxBar.hide();
				callback.apply(null, arguments);
			}:undefined);
		});
	},
	register: function(type, callback) {
		this.val.socket.on(type, callback);
	},
	ready: function(callback) {
		if(!this.val.socket.socket.connected)
			this.val.waiting.push(callback);
		else
			callback();
	}
};