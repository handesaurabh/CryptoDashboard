import { getCoinGeckoErrorMessage, requestCoinGecko } from "./coinGeckoClient";

export const getCoinList = async () => {
    try {
        const response = await requestCoinGecko({
            url: "/coins/markets",
            method: "get",
            params: {
                vs_currency: "inr",
                order: "market_cap_desc",
                per_page: 100,
                page: 1,
                sparkline: false,
            },
        });

        return response.data || [];
    } catch (error) {
        console.log("COIN LIST ERROR", getCoinGeckoErrorMessage(error), error);
        return [];
    }
};
