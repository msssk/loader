// TODO: fix Dojo2 deps
import * as aspect from '../../core/src/aspect';
import Promise from '../../core/src/Promise';

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

export default class HttpServer {
	contentTypes: any = {
		'': 'application/octet-stream',
		'.css': 'text/css',
		'.gif': 'image/gif',
		'.html': 'text/html',
		'.jpg': 'image/jpeg',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.png': 'image/png'
	}

	config: any;
	server: any;

	constructor(config: any) {
		this.config = config || {};
	}

	start(port: number = 9020) {
		return new Promise(function (resolve: Function) {
			this.server = http.createServer(this._handleRequest.bind(this));
			let sockets: any = [];

			// If sockets are not manually destroyed then Node.js will keep itself running until they all expire
			aspect.after(this.server, 'close', function () {
				let socket: any;
				while ((socket = sockets.pop())) {
					socket.destroy();
				}
			});

			this.server.on('connection', function (socket: any) {
				sockets.push(socket);

				// Disabling Nagle improves server performance on low-latency connections, which are more common
				// during testing than high-latency connections
				socket.setNoDelay(true);

				socket.on('close', function () {
					var index = sockets.indexOf(socket);
					index !== -1 && sockets.splice(index, 1);
				});
			});

			this.server.listen(port, resolve);
		}.bind(this));
	}

	stop() {
		return new Promise(function (resolve: Function) {
			if (this.server) {
				this.server.close(resolve);
			}
			else {
				resolve();
			}

			this.server = null;
		}.bind(this));
	}

	_handleRequest(request: any, response: any) {
		if (request.method === 'GET') {
			let file: string = /^\/+([^?]*)/.exec(request.url)[1];
			let wholePath: string = path.join(this.config.basePath, file);

			fs.stat(wholePath, function (error, status) {
				if (error) {
					this._send404(response);
					return;
				}

				let contentType: string = this.contentTypes[path.extname(wholePath)] || this.contentTypes[''];

				response.writeHead(200, {
					'Content-Type': contentType,
					'Content-Length': status.size
				});

				fs.createReadStream(wholePath).pipe(response);
			});
		}
		else {
			response.statusCode = 501;
			response.end();
		}
	}

	_send404(response: any) {
		response.writeHead(404, {
			'Content-Type': 'text/html;charset=utf-8'
		});
		response.end('<!DOCTYPE html><title>404 Not Found</title><h1>404 Not Found</h1><!-- ' +
			new Array(512).join('.') + ' -->');
	}
};
