/**
 * Module: connect
 * Purpose: Handles clicks on the connect button
 * Author: Clemens Damke
 */

new Modular("connect", ["events","socket","list"], function() {
	connect.val.button = $(connect.val.button);
	connect.val.button.on(events.click, function() {
		connect.do.fire();
	});
	
	socket.do.register("connect", function() {
		connect.do.activate();
	});
	socket.do.register("disconnect", function() {
		connect.do.deactivate();
	});
});

connect.val = {
	button: "#connectButton",
	onConnect: null,
	active: true
};

connect.do = {
	val: connect.val,
	fire: function() {
		var t = this;
		if(!t.val.active)
			return;
		if(list.val.activeId !== null) {
			t.val.active = false;
			socket.do.send("connectRobot", list.val.activeId, function(success) {
				if(success && t.val.onConnect)
					t.val.onConnect();
				else if(t.val.onFail) {
					t.val.active = true;
					t.val.onFail();
				}
			});
		}
	},
	onConnect: function(callback) {
		this.val.onConnect = callback;
	},
	onFail: function(callback) {
		this.val.onFail = callback;
	},
	activate: function() {
		this.val.button.removeClass("inactive");
	},
	deactivate: function() {
		if(!this.val.button.hasClass("inactive"))
			this.val.button.addClass("inactive");
	}
};