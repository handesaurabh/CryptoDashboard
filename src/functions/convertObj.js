export const coinObj = (data) => {
    if (!data) {
        return null;
    }

    const priceChangePercentage24h =
        data.market_data?.price_change_percentage_24h_in_currency?.inr ??
        data.market_data?.price_change_percentage_24h ??
        0;

    return {
        id: data.id || "",
        name: data.name || "",
        symbol: data.symbol || "",
        image: data.image?.large || "",
        desc: data.description?.en || "",
        price_change_percentage_24h: priceChangePercentage24h,
        total_volume: data.market_data?.total_volume?.inr || 0,
        current_price: data.market_data?.current_price?.inr || 0,
        market_cap: data.market_data?.market_cap?.inr || 0,
    };
}
