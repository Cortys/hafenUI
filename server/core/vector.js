var Vector = function(x, y) {
	this.x = x;
	this.y = y;
};

Vector.distanceSquare = function(v1, v2) {
	var x = v1.x-v2.x,
		y = v1.y-v2.y;
	return x*x + y*y;
};

Vector.distance = function(v1, v2) {
	return Math.sqrt(this.distanceSquare(v1, v2));
};

Vector.prototype = {
	distanceSquareTo: function(v) {
		this.distanceSquare(this, v);
	},
	distanceTo: function(v) {
		this.distance(this, v);
	}
};

module.exports = Vector;