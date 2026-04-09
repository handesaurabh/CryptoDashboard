import {
    getCoinGeckoErrorMessage,
    isCanceledRequest,
    requestCoinGecko,
} from "./coinGeckoClient";

const PUBLIC_API_MAX_HISTORY_DAYS = 365;
const SHORT_RANGE_FETCH_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getFetchWindow = (days) => {
    if (days <= 7) return SHORT_RANGE_FETCH_DAYS;
    if (days <= SHORT_RANGE_FETCH_DAYS) return SHORT_RANGE_FETCH_DAYS;
    if (days <= PUBLIC_API_MAX_HISTORY_DAYS) return PUBLIC_API_MAX_HISTORY_DAYS;
    return days;
};

const filterSeriesByDays = (series, days) => {
    if (!Array.isArray(series) || !series.length) {
        return [];
    }

    if (days >= PUBLIC_API_MAX_HISTORY_DAYS) {
        return series;
    }

    const latestTimestamp = series[series.length - 1]?.[0];

    if (!latestTimestamp) {
        return series;
    }

    const cutoffTimestamp = latestTimestamp - days * DAY_IN_MS;
    return series.filter(([timestamp]) => timestamp >= cutoffTimestamp);
};

const normalizeMarketDataForDays = (marketData, days) => {
    if (!marketData) {
        return marketData;
    }

    return {
        ...marketData,
        prices: filterSeriesByDays(marketData.prices, days),
        market_caps: filterSeriesByDays(marketData.market_caps, days),
        total_volumes: filterSeriesByDays(marketData.total_volumes, days),
    };
};

const fetchCoinPrice = async (id, days, signal) => {
    const response = await requestCoinGecko({
        url: `/coins/${id}/market_chart`,
        method: "get",
        params: {
            vs_currency: "inr",
            days,
        },
        signal,
    });

    return response.data;
};

export const getCoinPrice = async (id, days, signal) => {
    const normalizedDays =
        days === "max" ? PUBLIC_API_MAX_HISTORY_DAYS : Number(days);
    const fetchWindow = getFetchWindow(normalizedDays);

    try {
        const data = await fetchCoinPrice(id, fetchWindow, signal);
        const normalizedData = normalizeMarketDataForDays(data, normalizedDays);

        if (Array.isArray(normalizedData?.prices) && normalizedData.prices.length) {
            return normalizedData;
        }

        return normalizedData;
    } catch (error) {
        if (isCanceledRequest(error)) {
            return undefined;
        }

        console.log("CHART ERROR", getCoinGeckoErrorMessage(error), error);
        return undefined;
    }
};
