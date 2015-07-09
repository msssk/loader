import * as assert from 'intern/chai!assert';
import HttpServer from '../HttpServer';
import * as internConfig from '../intern';
import * as registerSuite from 'intern!object';
import * as topic from 'intern/dojo/topic';
import * as url from 'intern/dojo/node!url';
import * as util from './util';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

const amdAppMessage = 'Message from AMD app.';
const hostname = url.parse(internConfig.proxyUrl).hostname;
const portNumber = 9020;

let server: HttpServer;

registerSuite({
	name: 'AMD loading with CSP enabled',

	before() {
		if (!server) {
			server = new HttpServer();

			server.start(portNumber).then(function () {
				topic.subscribe('/runner/end', function () {
					server.stop();
				});
			});
		}
	},

	simple() {
		return util.executeTest(this, 'http://' + hostname +':' + portNumber + '/tests/functional/csp-simple.html', function (results: any) {
				assert.strictEqual(results.message, amdAppMessage, 'Local module should load');
			});
	},

	cdn() {
		const expected = {
			message: amdAppMessage,
			debounce: 'function'
		};

		return util.executeTest(this, 'http://' + hostname +':' + portNumber + '/tests/functional/csp-cdn.html', function (results: any) {
			assert.deepEqual(results, expected, 'Local module and CDN module should load');
		});
	}
});
