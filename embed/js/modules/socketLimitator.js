/**
 * Module: socketLimitator
 * Purpose: Limit number of socktes to server to one per client (= IP)
 * Author: Clemens Damke
 */

new Modular("socketLimitator", ["socket"], function() {
	this.do.test();
});

socketLimitator.val = {
	success: function() {},
	fail: function() {},
	made: null
};

socketLimitator.do = {
	val: socketLimitator.val,
	test: function() {
		var t = this;
		socket.do.register("alreadyConnected", function(data) {
			t.val[data.isUnconnected?"success":"fail"]();
			t.made = !!data.isUnconnected;
		});
	},
	onSuccess: function(callback) {
		this.val.success = callback;
		if(this.made === true)
			callback();
	},
	onFail: function(callback) {
		this.val.fail = callback;
		if(this.made === false)
			callback();
	}
};