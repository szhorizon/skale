#!/usr/local/bin/node --harmony

// parallelize -> persist -> sample -> count

var co = require('co');
var ugrid = require('../../lib/ugrid-context.js')();
var sample = require('../ugrid-test.js').sample;

process.on("exit", function () {console.assert(ugrid.grid.id !== undefined);});

co(function *() {
	yield ugrid.init();

	var v = [1, 2, 3, 4, 5];
	var frac = 0.1;
	var seed = 1;
	var withReplacement = true;

	var loc = sample(v, ugrid.worker.length, withReplacement, frac, seed);

	var data = ugrid.parallelize(v).persist();
	yield data.count();

	v.push(6);
	var dist = yield data.sample(withReplacement, frac).count();

	console.assert(loc.length == dist);

	ugrid.end();
}).catch(function (err) {
	console.error(err.stack);
	process.exit(1);
});
