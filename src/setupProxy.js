const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "https://api.coingecko.com",
            changeOrigin: true,
            secure: true,
        })
    );
};
