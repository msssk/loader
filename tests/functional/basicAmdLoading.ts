import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as Suite from 'intern/lib/Suite';
import * as Command from 'leadfoot/Command';
import * as util from './util';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

const amdAppMessage = 'Message from AMD app.';

registerSuite({
	name: 'basic AMD loading',

	'simple test'() {
		return util.executeTest(this, './basicAmdLoading.html', function (results: any) {
				assert.strictEqual(results.message, amdAppMessage);
			});
	},

	'AMD module with ID'() {
		return util.executeTest(this, './amdModuleWithId1.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Test module should load');
		});
	},

	'AMD module with ID - separate module file'() {
		return util.executeTest(this, './amdModuleWithId1a.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Test module should load');
		});
	},

	'AMD module with ID and dependency - ID'() {
		return util.executeTest(this, './amdModuleWithId2.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Dependency module should load');
			assert.strictEqual(results.testModule2Value, 'testModule2', 'Test module should load');
		});
	},

	'AMD module with ID and dependency - ID and separate module files'() {
		return util.executeTest(this, './amdModuleWithId2a.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Dependency module should load');
			assert.strictEqual(results.testModule2Value, 'testModule2', 'Test module should load');
		});
	},

	'AMD module with ID and dependency - module'() {
		return util.executeTest(this, './amdModuleWithId3.html', function (results: any) {
			assert.strictEqual(results.appModuleValue, amdAppMessage, 'Test module and dependency should load');
			assert.strictEqual(results.testModule3Value, 'testModule3', 'Test module and dependency should load');
		});
	},

	'AMD module with ID and dependency - module and separate module files'() {
		return util.executeTest(this, './amdModuleWithId3a.html', function (results: any) {
			assert.strictEqual(results.appModuleValue, amdAppMessage, 'Test module and dependency should load');
			assert.strictEqual(results.testModule3Value, 'testModule3', 'Test module and dependency should load');
		});
	},

	'AMD module without ID and dependency - id'() {
		return util.executeTest(this, './amdModuleWithId4.html', function (results: any) {
			assert.strictEqual(results, 'testModule1', 'Test module and dependency should load');
		});
	},

	'AMD module without ID and dependency - id and separate module files'() {
		return util.executeTest(this, './amdModuleWithId4a.html', function (results: any) {
			assert.strictEqual(results, 'testModule1', 'Test module and dependency should load');
		});
	},

	'AMD module with ID - dependency param omitted'() {
		return util.executeTest(this, './amdModuleWithId5.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Test module should load');
		});
	},

	'AMD module with circular dependency'() {
		const expected = {
			default: 'circular2',
			message: 'circular1.getMessage'
		};

		return util.executeTest(this, './amdModuleCircular.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'AMD module with circular dependency 2'() {
		const expected = {
			default: 'circular2',
			message: 'circular1.getMessage'
		};

		return util.executeTest(this, './amdModuleCircular2.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'AMD module with circular dependency 3'() {
		const expected = {
			c1default: 'circular2',
			c1message: 'circular1.getMessage',
			c2default: 'circular2',
			c2message: 'circular1.getMessage'
		};

		return util.executeTest(this, './amdModuleCircular3.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'AMD module with deep dependencies'() {
		const expected = {
			objectExport: 'objectExport'
		};

		return util.executeTest(this, './amdModuleDeepDeps.html', function (results: any) {
			assert.deepEqual(results, expected, 'Deep dependency should be resolved');
		});
	}
});
