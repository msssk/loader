import * as Command from 'leadfoot/Command';
import * as Suite from 'intern/lib/Suite';

import pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');

export function executeTest(suite: Suite, htmlTestPath: string, testFn: (result: any) => void, timeout = 5000): Command<any> {
	return suite.remote
		.get((<any>require).toUrl(htmlTestPath))
		.then(pollUntil<any>(function () {
			return (<any>window).loaderTestResults;
		}, null, timeout), undefined)
		.then(testFn, function () {
			throw new Error('loaderTestResult was not set.');
		});
}
