import * as http from "http";
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent = new SocksProxyAgent({
    host: '127.0.0.1',
    port: 9050,
});

export const runProxy = (target: string, voter_id: string, voter_password: string, callback: () => void): http.Server => {
    const app = express();

    app.use('/', createProxyMiddleware({
        target,
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
            '^/': ''
        },
        headers: {
            'X-helios-voter': voter_id,
            'X-helios-voter-password': voter_password,
        },
        agent,
    }));

    return app.listen(9051, callback);
}
