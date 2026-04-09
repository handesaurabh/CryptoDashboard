import {
    getCoinGeckoErrorMessage,
    isCanceledRequest,
    requestCoinGecko,
} from "./coinGeckoClient";

export const getCoinData = (id, signal) => {
    return requestCoinGecko({
        url: `/coins/${id}`,
        method: "get",
        params: {
            localization: false,
            tickers: false,
            community_data: false,
            developer_data: false,
            sparkline: false,
        },
        signal,
    })
        .then((res) => res.data)
        .catch((error) => {
            if (isCanceledRequest(error)) {
                return undefined;
            }

            console.log("COIN DATA ERROR", getCoinGeckoErrorMessage(error), error);
            return undefined;
        });
};
