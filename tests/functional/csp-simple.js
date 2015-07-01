require({
	packages: [
		{ name: 'amdApp', location: './amdApp' }
	]
}, [
	'amdApp/app'
], function (app) {
	window.loaderTestResults = {
		message: app.getMessage()
	};
});
