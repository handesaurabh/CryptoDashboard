import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader/Loader";
import BackToTop from "../components/Common/BackToTop/BackToTop";
import List from "../components/Dashboard/List/List";
import SelectDays from "../components/Coin/SelectDays/SelectDays";
import PriceType from "../components/Coin/PriceType/PriceType";
import LineChart from "../components/Coin/LineChart/LineChart";
import SelectCoins from "../components/Compare/SelectCoins/SelectCoins";
import { getCoinList } from "../functions/getCoinList";
import { getCoinPrice } from "../functions/getCoinPrice";
import {
    buildCompareChartData,
    comparePriceTypeConfig,
    defaultCompareSelection,
} from "../functions/compareUtils";

const buildCompareCoinSummary = (coin = {}) => ({
    id: coin.id || "",
    name: coin.name || "",
    symbol: coin.symbol || "",
    image: coin.image || "",
    price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
    total_volume: coin.total_volume ?? 0,
    current_price: coin.current_price ?? 0,
    market_cap: coin.market_cap ?? 0,
});

const ComparePage = () => {
    const [availableCoins, setAvailableCoins] = useState([]);
    const [selectedCoins, setSelectedCoins] = useState(defaultCompareSelection);
    const [days, setDays] = useState(30);
    const [priceType, setPriceType] = useState("prices");
    const [compareCoins, setCompareCoins] = useState([]);
    const [loadingCoins, setLoadingCoins] = useState(true);
    const [loadingComparison, setLoadingComparison] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getCoins = async () => {
            setLoadingCoins(true);
            const coins = await getCoinList();
            setAvailableCoins(coins);
            setLoadingCoins(false);

            if (!coins.length) {
                setLoadingComparison(false);
                setError("Unable to load coins for comparison right now.");
                return;
            }

            setSelectedCoins((currentSelection) => {
                const coinIds = coins.map((coin) => coin.id);

                const firstCoin = coinIds.includes(currentSelection.coin1)
                    ? currentSelection.coin1
                    : coinIds[0];

                const secondCoinCandidate = coinIds.includes(currentSelection.coin2)
                    ? currentSelection.coin2
                    : coinIds[1];

                const secondCoin =
                    secondCoinCandidate && secondCoinCandidate !== firstCoin
                        ? secondCoinCandidate
                        : coinIds.find((coinId) => coinId !== firstCoin) || firstCoin;

                return {
                    coin1: firstCoin,
                    coin2: secondCoin,
                };
            });
        };

        getCoins();
    }, []);

    const availableCoinMap = useMemo(
        () =>
            availableCoins.reduce((coinMap, coin) => {
                coinMap[coin.id] = buildCompareCoinSummary(coin);
                return coinMap;
            }, {}),
        [availableCoins]
    );

    useEffect(() => {
        const controller = new AbortController();
        let isActive = true;

        const getComparisonData = async () => {
            if (!selectedCoins.coin1 || !selectedCoins.coin2 || !availableCoins.length) {
                return;
            }

            setLoadingComparison(true);
            setError("");

            const coinIds = [selectedCoins.coin1, selectedCoins.coin2];
            const compareDays = days === "max" ? "max" : Number(days);
            const selectedCoinSummaries = coinIds.map((coinId) => availableCoinMap[coinId]);

            if (selectedCoinSummaries.some((coin) => !coin)) {
                setCompareCoins([]);
                setError("Unable to load the selected coins right now.");
                setLoadingComparison(false);
                return;
            }

            try {
                const marketResponses = [];

                for (const coinId of coinIds) {
                    if (!isActive) return;

                    const marketData = await getCoinPrice(coinId, compareDays, controller.signal);
                    marketResponses.push(marketData);
                }

                if (!isActive) return;

                const validCoins = selectedCoinSummaries
                    .map((coin, index) => {
                        const marketData = marketResponses[index];

                        if (!Array.isArray(marketData?.prices) || marketData.prices.length === 0) {
                            console.warn(`No market data for ${coinIds[index]} on days=${compareDays}`, marketData);
                            return null;
                        }

                        return {
                            ...coin,
                            marketData: {
                                prices: marketData.prices,
                                market_caps: Array.isArray(marketData.market_caps)
                                    ? marketData.market_caps
                                    : [],
                                total_volumes: Array.isArray(marketData.total_volumes)
                                    ? marketData.total_volumes
                                    : [],
                            },
                        };
                    })
                    .filter(Boolean);

                if (validCoins.length !== 2) {
                    setCompareCoins([]);
                    setError("Unable to fetch complete chart data for that range right now.");
                } else {
                    setCompareCoins(validCoins);
                }
            } catch (comparisonError) {
                if (comparisonError.name === "CanceledError") return;
                console.log("COMPARE PAGE ERROR", comparisonError);
                setCompareCoins([]);
                setError("Something went wrong while comparing these coins.");
            } finally {
                if (isActive) {
                    setLoadingComparison(false);
                }
            }
        };

        getComparisonData();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [availableCoinMap, availableCoins.length, days, selectedCoins]);

    const chartData = useMemo(
        () => buildCompareChartData(compareCoins, priceType),
        [compareCoins, priceType]
    );

    const handleCoinsChange = (newSelectedCoins) => {
        setSelectedCoins(newSelectedCoins);
    };

    const handlePriceTypeChange = (event, nextType) => {
        if (!nextType) return;
        setPriceType(nextType);
    };

    const isLoading = loadingCoins || loadingComparison;
    const chartTitle = compareCoins.map((coin) => coin.name).join(" vs ");

    return (
        <div className="compare-page">
            <Header />
            <BackToTop />

            <section className="compare-hero">
                <p className="compare-hero-eyebrow">Compare Crypto</p>
                <h1>Track two coins side by side</h1>
                <p className="compare-hero-copy">
                    Switch assets, change the range, and compare price, market cap, or
                    volume from the same screen.
                </p>
            </section>

            <SelectCoins
                coins={availableCoins}
                selectedCoins={selectedCoins}
                onCoinsChange={handleCoinsChange}
            />
            <SelectDays days={days} onDaysChange={setDays} />
            <PriceType
                priceType={priceType}
                handlePriceTypeChange={handlePriceTypeChange}
            />

            {isLoading ? (
                <Loader />
            ) : error ? (
                <section className="compare-feedback-card">
                    <h2>Comparison unavailable</h2>
                    <p>{error}</p>
                </section>
            ) : (
                <>
                    <section className="compare-summary-grid">
                        {compareCoins.map((coin, index) => (
                            <article key={coin.id} className="compare-summary-card">
                                <div className="compare-summary-header">
                                    <p className="compare-summary-eyebrow">Coin {index + 1}</p>
                                    <h2>{coin.name}</h2>
                                    <p className="compare-summary-symbol">
                                        {coin.symbol?.toUpperCase()}
                                    </p>
                                </div>
                                <div className="compare-summary-table-wrap">
                                    <table className="list-table compare-summary-table">
                                        <tbody>
                                            <List coin={coin} isClickable={false} />
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        ))}
                    </section>

                    <LineChart
                        chartData={chartData}
                        coinName={chartTitle}
                        days={days}
                        priceType={comparePriceTypeConfig[priceType]?.label || "Price"}
                        multiAxis={true}
                    />
                </>
            )}
        </div>
    );
};

export default ComparePage;
