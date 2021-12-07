import * as crypto from 'crypto';
import * as http from 'http';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { PROXY_PORT, TOR_HOST, TOR_PORT } from './constants';

const agent = new SocksProxyAgent({
	host: TOR_HOST,
	port: TOR_PORT,
});

export const runProxy = (
	target: string,
	voterId: string,
	voterPassword: string,
	callback: () => void
): http.Server => {
	const app = express();

	app.use((req, res, next) => {
		setTimeout(next, Math.floor(Math.random() * 4096));
	});

	app.use(
		'/',
		createProxyMiddleware({
			target,
			changeOrigin: true,
			logLevel: 'info',
			pathRewrite: {
				'^/': '',
			},
			headers: {
				'X-helios-voter': voterId,
				'X-helios-voter-password': voterPassword,
				'X-noise': crypto
					.randomBytes(Math.floor(Math.random() * 1024))
					.toString('hex'),
			},
			agent,
		})
	);

	return app.listen(PROXY_PORT, callback);
};
