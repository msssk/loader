import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as Suite from 'intern/lib/Suite';
import * as Command from 'leadfoot/Command';
import * as util from './util';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

const amdAppMessage = 'Message from AMD app.';

var originalInstrumentationValue: any;
var proxy: any;

registerSuite({
	name: 'AMD loading with CSP enabled',

	setup() {
		// WARNING: HACKY SOLUTION AHEAD (Intern 3 only)
		// Intern's public API does not provide for modifying the configuration at run-time.
		// However, for modifying the Proxy configuration, you can get a reference to the proxy on
		// the ClientSuite... which is stored in the 'tests' array on a Suite's parent.
		// By changing the value of 'excludeInstrumentation' before the tests are executed, we can prevent
		// the proxy from instrumenting 'loader.js' (Istanbul uses 'Function' which runs afoul of CSP).
		// After this test suite runs we restore the original value to avoid interfering with other tests.
		// TODO: does this work when multiple tests are running? What if one WebDriver remote is running non-CSP
		// tests while one remote is running the CSP tests - do they share the same proxy, and hence the same
		// instrumentation config?
		this.parent.tests.some(function (item: any) {
			if (item.proxy) {
				proxy = item.proxy;
			}
		});

		if (proxy) {
			originalInstrumentationValue = proxy.config.excludeInstrumentation;
			proxy.config.excludeInstrumentation = true;
		}
	},

	teardown() {
		if (proxy) {
			proxy.config.excludeInstrumentation = originalInstrumentationValue;
		}
	},

	simple() {
		return util.executeTest(this, './csp-simple.html', function (results: any) {
				assert.strictEqual(results.message, amdAppMessage, 'Local module should load');
			});
	},

	cdn() {
		const expected = {
			message: amdAppMessage,
			debounce: 'function'
		};

		return util.executeTest(this, './csp-cdn.html', function (results: any) {
			assert.deepEqual(results, expected, 'Local module and CDN module should load');
		});
	}
});
