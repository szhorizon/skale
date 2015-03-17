#!/usr/local/bin/node --harmony

// Test randomSVMData -> reduceByKey -> lookup

var co = require('co');
var ugrid = require('../../lib/ugrid-context.js')();
var test = require('../ugrid-test.js');

process.on('exit', function () {console.assert(ugrid.grid.id !== undefined);});

co(function *() {
	yield ugrid.init();

	function sum(a, b) {
		a += b;
		return a;
	}

	var N = 5, D = 1, seed = 1, key = 1;
	var ref = test.randomSVMData(N, D, seed, ugrid.worker.length);
	var ref = test.reduceByKey(ref, sum, 0).filter(function (e) {return e[0] == key;});

	var res = yield ugrid.randomSVMData(N, D, seed).reduceByKey(sum, 0).lookup(key);

	console.assert(test.arrayEqual(ref, res));

	ugrid.end();
}).catch(function (err) {
	console.error(err.stack);
	process.exit(1);
});
