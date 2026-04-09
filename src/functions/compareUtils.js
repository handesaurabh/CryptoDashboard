const compareColors = [
    {
        borderColor: "#00d4ff",
        backgroundColor: "rgba(0, 212, 255, 0.16)",
    },
    {
        borderColor: "#38df4f",
        backgroundColor: "rgba(56, 223, 79, 0.16)",
    },
    {
        borderColor: "#f7b801",
        backgroundColor: "rgba(247, 184, 1, 0.16)",
    },
];

export const comparePriceTypeConfig = {
    prices: {
        label: "Price",
    },
    market_caps: {
        label: "Market Cap",
    },
    total_volumes: {
        label: "Total Volume",
    },
};

export const defaultCompareSelection = {
    coin1: "bitcoin",
    coin2: "ethereum",
};

export const updateCompareSelection = (currentSelection = defaultCompareSelection, field, nextValue) => {
    const nextSelection = {
        ...defaultCompareSelection,
        ...currentSelection,
        [field]: nextValue,
    };

    const otherField = field === "coin1" ? "coin2" : "coin1";

    if (nextValue && nextValue === nextSelection[otherField]) {
        nextSelection[otherField] = currentSelection?.[field] || defaultCompareSelection[field];
    }

    return nextSelection;
};

export const buildCompareChartData = (coins = [], priceType = "prices") => {
    // Normalize timestamps to the nearest hour to align data points between different coins
    const HOUR = 3600000;

    const timestamps = Array.from(
        new Set(
            coins.flatMap((coin) => {
                const dataPoints = coin?.marketData?.[priceType];
                return Array.isArray(dataPoints) ? dataPoints.map(([timestamp]) => Math.floor(timestamp / HOUR) * HOUR) : [];
            })
        )
    ).sort((firstTimestamp, secondTimestamp) => firstTimestamp - secondTimestamp);

    if (!timestamps.length) {
        return null;
    }

    const datasets = coins
        .map((coin, index) => {
            const series = Array.isArray(coin?.marketData?.[priceType]) ? coin.marketData[priceType] : [];

            if (!series.length) {
                return null;
            }

            const valueByTimestamp = new Map(series.map(([timestamp, value]) => [
                Math.floor(timestamp / HOUR) * HOUR,
                value
            ]));
            const colors = compareColors[index % compareColors.length];

            return {
                label: coin?.name || `Coin ${index + 1}`,
                data: timestamps.map((timestamp) => valueByTimestamp.get(timestamp) ?? null),
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
                borderWidth: 2.5,
                fill: false,
                tension: 0.28,
                pointRadius: 0,
            };
        })
        .filter(Boolean);

    if (!datasets.length) {
        return null;
    }

    return {
        labels: timestamps.map((timestamp) =>
            new Date(timestamp).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            })
        ),
        datasets,
    };
};
