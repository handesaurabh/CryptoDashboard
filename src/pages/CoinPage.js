import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from '../components/Common/Header';
import Loader from '../components/Common/Loader/Loader';
import { coinObj } from '../functions/convertObj';
import CoinInfo from '../components/Coin/CoinInfo/CoinInfo';
import CoinSummaryCard from '../components/Coin/CoinSummaryCard/CoinSummaryCard';
import { getCoinData } from '../functions/getCoinData';
import { getCoinPrice } from '../functions/getCoinPrice';
import LineChart from '../components/Coin/LineChart/LineChart';
import SelectDays from '../components/Coin/SelectDays/SelectDays';
import PriceType from '../components/Coin/PriceType/PriceType';
import { hasCgKey } from '../functions/coinGeckoClient';

const priceTypeConfig = {
    prices: {
        label: "Price",
        borderColor: "#3a80e9",
        backgroundColor: "rgba(58, 128, 233, 0.12)",
    },
    market_caps: {
        label: "Market Cap",
        borderColor: "#00d4ff",
        backgroundColor: "rgba(0, 212, 255, 0.12)",
    },
    total_volumes: {
        label: "Total Volume",
        borderColor: "#38df4f",
        backgroundColor: "rgba(56, 223, 79, 0.14)",
    },
};

const buildChartData = (marketData = {}, coinName = "", priceType = "prices") => {
    const safePrices = Array.isArray(marketData?.[priceType]) ? marketData[priceType] : [];
    const config = priceTypeConfig[priceType] || priceTypeConfig.prices;

    return {
        labels: safePrices.map(([timestamp]) =>
            new Date(timestamp).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            })
        ),
        datasets: [
            {
                label: `${coinName || "Coin"} ${config.label} (INR)`,
                data: safePrices.map(([, price]) => price),
                borderColor: config.borderColor,
                backgroundColor: config.backgroundColor,
                borderWidth: 2,
                fill: true,
                tension: 0.25,
                pointRadius: 0,
            },
        ],
    };
};

const CoinPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [coinData, setCoinData] = useState();
    const [days, setDays] = useState(30);
    const [marketData, setMarketData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [priceType, setPriceType] = useState('prices');
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        let isActive = true;

        const getData = async () => {
            setLoading(true);
            setError("");

            const coinDetails = await getCoinData(id, controller.signal);
            const formattedCoinData = coinObj(coinDetails);

            if (!formattedCoinData) {
                if (!isActive) return;

                setCoinData(null);
                setMarketData(null);
                setChartData(null);
                setError(
                    hasCgKey
                        ? "Unable to load coin details right now."
                        : "Unable to load coin details right now. Add REACT_APP_CG_KEY to .env.local and restart the app if CoinGecko is rejecting browser requests."
                );
                setLoading(false);
                return;
            }

            const fetchDays = days === "max" ? "max" : Number(days);
            const chartResponse = await getCoinPrice(id, fetchDays, controller.signal);

            if (!isActive) return;

            setMarketData(chartResponse || null);

            setCoinData({
                ...formattedCoinData,
                prices: chartResponse?.prices || [],
            });

            if (!chartResponse) {
                setError("Coin details loaded, but chart data is unavailable right now.");
            }

            setLoading(false);
        };

        if (id) {
            getData();
        }

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [days, id]);

    useEffect(() => {
        if (!coinData || !marketData) {
            setChartData(null);
            return;
        }

        setChartData(buildChartData(marketData, coinData.name, priceType));
    }, [coinData, marketData, priceType]);

    const handlePriceTypeChange = (event, newType) => {
        if (!newType) return;
        setPriceType(newType);
    };

    return (
        <div>
            <Header />
            {loading ? (
                <Loader />
            ) : coinData ? (
                <>
                    <div className='coin-container'>
                        <CoinSummaryCard coin={coinData} />
                    </div>
                    <SelectDays days={days} onDaysChange={setDays} />
                    <PriceType priceType={priceType} handlePriceTypeChange={handlePriceTypeChange} />
                    {error && <p>{error}</p>}
                    <LineChart
                        chartData={chartData}
                        coinName={coinData.name}
                        days={days}
                        priceType={priceTypeConfig[priceType]?.label || "Price"}
                    />
                    <CoinInfo heading={coinData.name} desc={coinData.desc} />
                </>
            ) : (
                <p>{error || "Unable to load coin details."}</p>
            )}
        </div>
    )
}

export default CoinPage
