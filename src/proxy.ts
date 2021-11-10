import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent = new SocksProxyAgent({
    host: '127.0.0.1',
    port: 9050,
});

const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://helios-server-tor.herokuapp.com',
    changeOrigin: true,
    // logLevel: "debug",
    agent
}));
app.listen(9051);
