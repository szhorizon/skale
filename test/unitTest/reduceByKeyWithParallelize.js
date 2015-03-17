#!/usr/local/bin/node --harmony
'use strict';

var co = require('co');
var assert = require('assert');
var ugrid = require('../../lib/ugrid-context.js')();

process.on("exit", function () {console.assert(ugrid.grid.id !== undefined);});

co(function *() {
	yield ugrid.init();

	function reducer(a, b) {
		a += b;
		return a;
	}

	var a = [[0, 1], [0, 2], [1, 3], [1, 4]];

	var points = yield ugrid.parallelize(a)
		.reduceByKey(reducer, 0)
		.collect();

	console.log(points);

	ugrid.end();
}).catch(function (err) {
	console.error(err.stack);
	process.exit(1);
});
