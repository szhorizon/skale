#!/usr/local/bin/node --harmony

// Test randomSVMData -> flatMapValues -> count

var co = require('co');
var ugrid = require('../../lib/ugrid-context.js')();
var test = require('../ugrid-test.js');

process.on('exit', function () {console.assert(ugrid.grid.id !== undefined);});

co(function *() {
	yield ugrid.init();

	var N = 5, D = 1, seed = 1;

	function mapper(e) {
		var out = [];
		for (var i = e; i <= 5; i++)
			out.push(i);
		return out;
	}

	var ref = test.randomSVMData(N, D, seed);
	ref = test.flatMapValues(ref, mapper);
	var res = yield ugrid.randomSVMData(N, D, seed).flatMapValues(mapper).count();
	console.assert(ref.length == res);

	ugrid.end();
}).catch(function (err) {
	console.error(err.stack);
	process.exit(1);
});
