import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as Suite from 'intern/lib/Suite';
import * as Command from 'leadfoot/Command';
import * as util from './util';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

const amdAppMessage = 'Message from AMD app.';

registerSuite({
	name: 'AMD loading with CSP enabled',

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
			assert.strictEqual(results, expected, 'Local module and CDN module should load');
		});
	}
});
