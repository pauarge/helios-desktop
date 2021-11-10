import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent = new SocksProxyAgent({
    host: '127.0.0.1',
    port: 9050,
});

export const run = (): void => {
    const app = express();

    app.use('/', createProxyMiddleware({
        target: 'https://helios-server-tor.herokuapp.com/helios/elections/ee38c1b6-3a6f-11ec-ba4f-9e9d7abbf550',
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
            '^/': ''
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-helios-voter', 'pau');
            proxyReq.setHeader('X-helios-voter-password', '2kMsyrVFpg')
        }
        // agent,
    }));

    app.listen(9051);
}
