import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as Suite from 'intern/lib/Suite';
import * as Command from 'leadfoot/Command';
import * as util from './util';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

const appMessage = 'Message from CommonJS app.';

registerSuite({
	name: 'basic CommonJS loading',

	'simple test'() {
		return util.executeTest(this, './basicCommonJsLoading.html', function (results: any) {
				assert.strictEqual(results.message, appMessage);
			});
	},

	'CommonJS module with ID'() {
		return util.executeTest(this, './commonJsModuleWithId1.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Test module with explicit mid should load');
		});
	},

	'CommonJS module with ID and dependency - ID'() {
		const expected = {
			testModule1Value: 'testModule1',
			testModule2Value: 'testModule2'
		};

		return util.executeTest(this, './commonJsModuleWithId2.html', function (results: any) {
			assert.deepEqual(results, expected, 'Test modules with explicit mids should load');
		});
	},

	'CommonJS module with ID and dependency - module'() {
		const expected = {
			appModuleValue: appMessage,
			testModule3Value: 'testModule3'
		};

		return util.executeTest(this, './commonJsModuleWithId3.html', function (results: any) {
			assert.deepEqual(results, expected, 'Test module and dependency should load');
		});
	},

	'CommonJS module without ID and dependency - id'() {
		return util.executeTest(this, './commonJsModuleWithId4.html', function (results: any) {
			assert.strictEqual(results, 'testModule1', 'Test module and dependency should load');
		});
	},

	'CommonJS module with circular dependency'() {
		const expected = {
			message: 'circular1',
			circular2Message: 'circular2'
		};

		return util.executeTest(this, './commonJsModuleCircular.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'CommonJS module with circular dependency 2'() {
		const expected = {
			message: 'circular2',
			circular1Message: 'circular1'
		};

		return util.executeTest(this, './commonJsModuleCircular2.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'CommonJS module with circular dependency 3'() {
		const expected = {
			c1message: 'circular1',
			c1message2: 'circular2',
			c2message: 'circular2',
			c2message1: 'circular1'
		};

		return util.executeTest(this, './commonJsModuleCircular3.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'CommonJS module with deep dependencies'() {
		const expected = {
			objectExport: 'objectExport'
		};

		return util.executeTest(this, './commonJsModuleDeepDeps.html', function (results: any) {
			assert.deepEqual(results, expected, 'Deep dependency should be resolved');
		});
	}
});
