var db = require("../connectivity/db.js"),
	Heap = require("heap"),
	async = require("async"),
	Vector = require("../vector.js"),

/**
 * Route Calculator
 * Main Class using A* to calculate shortest paths
 * Retrieves points from DB
 */

RouteCalculator = function(map) { // map id
	this.map = map*1;
};

RouteCalculator.prototype = {
	map: null,
	points: null,
	
	init: function(lastPoint, currentPoint, targetPoint, callback) {
		var t = this,
			done = function() {
				if(typeof callback == "function")
					callback(t.points[lastPoint], t.points[currentPoint], t.points[targetPoint]);
			};
		
		if(t.points)
			done();
		else
			db.query("SELECT * FROM `points` WHERE `map` = "+this.map, function(err, result) {
				if(!err) {
					t.points = [];
					for(var i = 0; i < result.length; i++)
						t.points[result[i].id] = result[i];
					done();
				}
			});
	},
	
	calculate: function(lastPoint, currentPoint, targetPoint, done) {
		var t = this;
		
		t.init(lastPoint, currentPoint, targetPoint, function(lastPoint, currentPoint, targetPoint) {
			if(!lastPoint || !currentPoint || !targetPoint) {
				done([]);
				return;
			}
			
			// A* algorithm:
			
			var before = new HiddenWayPoint(lastPoint);
				start = new WayPoint(currentPoint, before, targetPoint),
				
				openHeap = new Heap(function(a, b) { // open list with comparator function
					return a.distance - b.distance;
				}),
				table = [], // hash table of all open list entries that ever existed (used to replace points)
				
				point = null; // currently viewed point
			
			openHeap.push(start);
			table[start.id()] = start;
			
			async.whilst(function() { return openHeap && !openHeap.empty(); }, function(callback) { // asynchronous while loop (DB lookups for neighbor points take some time)
				point = openHeap.pop();
				
				if(point.id() == targetPoint.id) {
					openHeap = null;
					callback();
					return;
				}
				point.possibleWays(function(wayPoints) {
					for(var i = 0; i < wayPoints.length; i++) {
						var possible = wayPoints[i],
							currentPoint = table[possible.id()];
						if(currentPoint === undefined) {
							table[possible.id()] = possible;
							openHeap.push(possible);
						}
						else {
							if(currentPoint.closed || currentPoint.distance <= possible.distance)
								continue;
							currentPoint.update(possible.current, possible.last);
							openHeap.updateItem(currentPoint);
						}
					}
					callback();
				});
				
			}, function() { // recursive reconstruction of the path after completing the while loop:
				var path = [],
					recursion = function(p) {
						if(p === before || !p) // stop recursion if before point is reached (or later if unexpected error should occur)
							return;
						path.unshift(p.current);
						recursion(p.last);
					};
				recursion(point);
				if(typeof done == "function")
					done(path);
			});
		});
	}
};

/**
 * Way Point
 * Single point on the route for A*
 * Operates with points from DB, retrieves turns from DB
 */

var WayPoint = function(point, lastWayPoint, target) {
	this.update(point, lastWayPoint, target);
};

WayPoint.prototype = {
	distanceMade: 0,
	distanceToDo: 0,
	distance: 0,
	current: null,
	last: null,
	target: null,
	closed: false, // closed flag replaces A* closed list
	
	id: function() {
		return this.current.id;
	},
	
	possibleWays: function(callback) {
		var t = this;
		t.closed = true;
		db.query("SELECT `points`.*, `turns`.`direction` FROM `points` INNER JOIN `turns` ON `points`.`id` = `turns`.`nextPoint` WHERE `lastPoint` = "+(t.last.current.id*1)+" AND `currentPoint` = "+(t.current.id*1), function(err, result) {
			if(!err) {
				for(var i = 0; i < result.length; i++)
					result[i] = new WayPoint(result[i], t, t.target);
				callback(result);
			}
			else
				callback([]);
		});
	},
	
	update: function(point, lastWayPoint, target) {
		this.current = point;
		this.last = lastWayPoint;
		
		if(lastWayPoint instanceof WayPoint && !(lastWayPoint instanceof HiddenWayPoint))
			this.distanceMade = lastWayPoint.distanceMade + Vector.distance(this.current, lastWayPoint.current);
		
		if(target && target !== this.target) {
			this.target = target;
			this.distanceToDo = Vector.distance(this.current, target);
		}
		
		this.distance = this.distanceMade + this.distanceToDo;
	}
};

/**
 * Hidden Way Point
 * Way Points that make the point that was current before calculations started
 * Used to determine the initial orientation -> turn around if neccessary
 * No DB access
 */

var HiddenWayPoint = function(point) {
	WayPoint.call(this, point, null, null);
};
HiddenWayPoint.prototype = Object.create(WayPoint.prototype);
HiddenWayPoint.prototype.constructor = HiddenWayPoint;

/**
 * END OF CLASSES
 */

module.exports = RouteCalculator;