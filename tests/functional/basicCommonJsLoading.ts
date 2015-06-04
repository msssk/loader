import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as Suite from 'intern/lib/Suite';
import * as Command from 'leadfoot/Command';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

function executeTest(suite: Suite, htmlTestPath: string, testFn: (result: any) => void, timeout = 5000): Command<any> {
	return suite.remote
		.get((<any>require).toUrl(htmlTestPath))
		.then(pollUntil<any>(function () {
			return (<any>window).loaderTestResults;
		}, null, timeout), undefined)
		.then(testFn, function () {
			throw new Error('loaderTestResult was not set.');
		});
}

registerSuite({
	name: 'basic CommonJS loading',

	'simple test'() {
		return executeTest(this, './basicCommonJsLoading.html', function (results: any) {
				assert.strictEqual(results.message, 'Message from CommonJS app.');
			});
	},

	'CommonJS module with ID'() {
		return executeTest(this, './commonJsModuleWithId1.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Test module should load');
		});
	},

	'CommonJS module with ID and dependency - ID'() {
		return executeTest(this, './commonJsModuleWithId2.html', function (results: any) {
			assert.strictEqual(results.testModule1Value, 'testModule1', 'Dependency module should load');
			assert.strictEqual(results.testModule2Value, 'testModule2', 'Test module should load');
		});
	},

	'CommonJS module with ID and dependency - module'() {
		return executeTest(this, './commonJsModuleWithId3.html', function (results: any) {
			assert.isTrue(results.testModule3Loaded);
			assert.strictEqual(results.testModule3Value, 'testModule3', 'Test module and dependency should load');
		});
	},

	'CommonJS module without ID and dependency - id'() {
		return executeTest(this, './commonJsModuleWithId4.html', function (results: any) {
			assert.strictEqual(results, 'testModule1', 'Test module and dependency should load');
		});
	},

	'CommonJS module with circular dependency'() {
		const expected = {
			default: 'circular2',
			message: 'circular1.getMessage'
		};

		return executeTest(this, './commonJsModuleCircular.html', function (results: any) {
			assert.deepEqual(results, expected, 'Circular dependency should be resolved');
		});
	},

	'CommonJS module with deep dependencies'() {
		const expected = {
			objectExport: 'objectExport'
		};

		return executeTest(this, './commonJsModuleDeepDeps.html', function (results: any) {
			assert.deepEqual(results, expected, 'Deep dependency should be resolved');
		});
	}
});