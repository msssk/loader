import * as assert from 'intern/chai!assert';
import HttpServer from '../HttpServer';
import * as registerSuite from 'intern!object';
import * as topic from 'intern/dojo/topic';
import * as util from './util';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

const amdAppMessage = 'Message from AMD app.';

let server: HttpServer;

registerSuite({
	name: 'AMD loading with CSP enabled',

	before() {
		if (!server) {
			server = new HttpServer({
				baseUrl: '.'
			});

			server.start().then(function () {
				topic.subscribe('/runner/end', function () {
					server.stop();
				});
			});
		}
	},

	simple() {
		return util.executeTest(this, 'http://localhost:9020/tests/functional/csp-simple.html', function (results: any) {
				assert.strictEqual(results.message, amdAppMessage, 'Local module should load');
			});
	},

	cdn() {
		const expected = {
			message: amdAppMessage,
			debounce: 'function'
		};

		return util.executeTest(this, 'http://localhost:9020/tests/functional/csp-cdn.html', function (results: any) {
			assert.deepEqual(results, expected, 'Local module and CDN module should load');
		});
	}
});
