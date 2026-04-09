import axios from "axios";

const cgKey = process.env.REACT_APP_CG_KEY?.trim();
export const COIN_GECKO_URL = "https://api.coingecko.com/api/v3/coins/";
const directCgUrl = COIN_GECKO_URL.replace(/\/coins\/$/, "");
const cgBaseUrl =
    process.env.REACT_APP_CG_URL?.trim() ||
    (process.env.NODE_ENV === "development" ? "/api/v3" : directCgUrl);

export const hasCgKey = Boolean(cgKey);
const isLocalProxyUrl = cgBaseUrl.startsWith("/");
const defaultHeaders = {
    Accept: "application/json",
    ...(cgKey ? { "x-cg-demo-api-key": cgKey } : {}),
};

export const coinGeckoClient = axios.create({
    baseURL: cgBaseUrl,
    timeout: 15000,
    headers: defaultHeaders,
});

const cachedResponses = new Map();
const inflightRequests = new Map();
const RESPONSE_CACHE_TTL_MS = 5 * 60 * 1000;

export const isCanceledRequest = (error) =>
    axios.isCancel?.(error) || error?.name === "CanceledError";

const createCanceledError = () =>
    new axios.CanceledError("The request was canceled before it finished.");

// Shared GET requests ignore per-caller abort signals so one Strict Mode cleanup
// does not cancel the identical request needed by the next render pass.
const awaitWithSignal = (requestPromise, signal) => {
    if (!signal) {
        return requestPromise;
    }

    if (signal.aborted) {
        return Promise.reject(createCanceledError());
    }

    return new Promise((resolve, reject) => {
        let settled = false;

        const cleanup = () => {
            signal.removeEventListener("abort", handleAbort);
        };

        const finish = (callback) => (value) => {
            if (settled) return;
            settled = true;
            cleanup();
            callback(value);
        };

        const handleAbort = () => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(createCanceledError());
        };

        signal.addEventListener("abort", handleAbort, { once: true });
        requestPromise.then(finish(resolve), finish(reject));
    });
};

const buildRequestCacheKey = (config = {}) =>
    JSON.stringify({
        baseURL: cgBaseUrl,
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
            if (config.signal?.aborted) {
                throw createCanceledError();
            }

            return cachedEntry.response;
        }

        if (inflightRequests.has(cacheKey)) {
            return awaitWithSignal(inflightRequests.get(cacheKey), config.signal);
        }
    }

    const requestPromise = (async () => {
        try {
            const requestConfig = isGetRequest ? { ...config } : config;

            if (isGetRequest) {
                delete requestConfig.signal;
            }

            const response = await coinGeckoClient.request(requestConfig);

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
        return awaitWithSignal(requestPromise, config.signal);
    }

    inflightRequests.set(cacheKey, requestPromise);

    try {
        return await awaitWithSignal(requestPromise, config.signal);
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
            return hasCgKey
                ? "CoinGecko rejected the configured demo API key."
                : "CoinGecko requires a demo API key for this request. Add REACT_APP_CG_KEY to your local environment and restart the app.";
        }

        if (status === 429) {
            return "CoinGecko rate limit reached. Please wait a moment and try again.";
        }

        if (status === 404) {
            return isLocalProxyUrl
                ? "The local CoinGecko proxy is not responding. Restart the dev server so /api requests are forwarded correctly."
                : "CoinGecko returned 404 for this request.";
        }

        if (status >= 500) {
            return "CoinGecko is temporarily unavailable. Please try again shortly.";
        }

        if (error.request) {
            return hasCgKey
                ? "The browser could not reach CoinGecko right now."
                : "The browser could not reach CoinGecko. Add REACT_APP_CG_KEY to your local environment if CoinGecko is rejecting unauthenticated browser requests.";
        }
    }

    return "Unable to fetch data from CoinGecko right now.";
};
