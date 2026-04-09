import axios from "axios";

const coinGeckoDemoApiKey = process.env.REACT_APP_COINGECKO_DEMO_API_KEY?.trim();
export const COIN_GECKO_URL = "https://api.coingecko.com/api/v3/coins/";
const directCoinGeckoBaseUrl = COIN_GECKO_URL.replace(/\/coins\/$/, "");
const coinGeckoBaseUrl =
    process.env.REACT_APP_COINGECKO_BASE_URL?.trim() ||
    (process.env.NODE_ENV === "development" ? "/api/v3" : directCoinGeckoBaseUrl);

export const hasCoinGeckoDemoApiKey = Boolean(coinGeckoDemoApiKey);
const isLocalProxyBaseUrl = coinGeckoBaseUrl.startsWith("/");
const defaultHeaders = {
    Accept: "application/json",
    ...(coinGeckoDemoApiKey ? { "x-cg-demo-api-key": coinGeckoDemoApiKey } : {}),
};

export const coinGeckoClient = axios.create({
    baseURL: coinGeckoBaseUrl,
    timeout: 15000,
    headers: defaultHeaders,
});

const cachedResponses = new Map();
const inflightRequests = new Map();
const RESPONSE_CACHE_TTL_MS = 5 * 60 * 1000;

export const isCanceledRequest = (error) =>
    axios.isCancel?.(error) || error?.name === "CanceledError";

const buildRequestCacheKey = (config = {}) =>
    JSON.stringify({
        baseURL: coinGeckoBaseUrl,
        method: config.method || "get",
        url: config.url || "",
        params: config.params || {},
    });

export const requestCoinGecko = async (config) => {
    const cacheKey = buildRequestCacheKey(config);
    const isGetRequest = (config.method || "get").toLowerCase() === "get";

    if (isGetRequest) {
        const cachedEntry = cachedResponses.get(cacheKey);

        if (cachedEntry && Date.now() - cachedEntry.timestamp < RESPONSE_CACHE_TTL_MS) {
            return cachedEntry.response;
        }

        if (inflightRequests.has(cacheKey)) {
            return inflightRequests.get(cacheKey);
        }
    }

    const requestPromise = (async () => {
        try {
            const response = await coinGeckoClient.request(config);

            if (isGetRequest) {
                cachedResponses.set(cacheKey, {
                    response,
                    timestamp: Date.now(),
                });
            }

            return response;
        } catch (error) {
            throw error;
        }
    })();

    if (!isGetRequest) {
        return requestPromise;
    }

    inflightRequests.set(cacheKey, requestPromise);

    try {
        return await requestPromise;
    } finally {
        inflightRequests.delete(cacheKey);
    }
};

export const getCoinGeckoErrorMessage = (error) => {
    if (isCanceledRequest(error)) {
        return "The request was canceled before it finished.";
    }

    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            return hasCoinGeckoDemoApiKey
                ? "CoinGecko rejected the configured demo API key."
                : "CoinGecko requires a demo API key for this request. Add REACT_APP_COINGECKO_DEMO_API_KEY to your local environment and restart the app.";
        }

        if (status === 429) {
            return "CoinGecko rate limit reached. Please wait a moment and try again.";
        }

        if (status === 404) {
            return isLocalProxyBaseUrl
                ? "The local CoinGecko proxy is not responding. Restart the dev server so /api requests are forwarded correctly."
                : "CoinGecko returned 404 for this request.";
        }

        if (status >= 500) {
            return "CoinGecko is temporarily unavailable. Please try again shortly.";
        }

        if (error.request) {
            return hasCoinGeckoDemoApiKey
                ? "The browser could not reach CoinGecko right now."
                : "The browser could not reach CoinGecko. Add REACT_APP_COINGECKO_DEMO_API_KEY to your local environment if CoinGecko is rejecting unauthenticated browser requests.";
        }
    }

    return "Unable to fetch data from CoinGecko right now.";
};
