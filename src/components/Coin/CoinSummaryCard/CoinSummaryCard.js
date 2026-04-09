import React, { useEffect, useState } from "react";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
    addToWatchlist,
    isInWatchlist,
    removeFromWatchlist,
} from "../../../functions/watchlistUtils";
import "./CoinSummaryCard.css";

const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const CoinSummaryCard = ({ coin }) => {
    const [inWatchlist, setInWatchlist] = useState(false);
    const priceChangePercentage = Number(coin.price_change_percentage_24h || 0);
    const isPositive = priceChangePercentage >= 0;

    useEffect(() => {
        setInWatchlist(isInWatchlist(coin.id));
    }, [coin.id]);

    const handleWatchlistToggle = () => {
        const wasUpdated = inWatchlist
            ? removeFromWatchlist(coin.id)
            : addToWatchlist(coin);

        if (wasUpdated) {
            setInWatchlist(!inWatchlist);
        }
    };

    return (
        <section className="coin-summary-shell">
            <button
                type="button"
                className={`coin-summary-watchlist ${inWatchlist ? "coin-summary-watchlist-active" : ""}`}
                onClick={handleWatchlistToggle}
                aria-label={inWatchlist ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
            >
                {inWatchlist ? <StarIcon /> : <StarBorderIcon />}
            </button>

            <div className="coin-summary-head">
                <img src={coin.image} alt={`${coin.name} logo`} className="coin-summary-logo" />
                <div className="coin-summary-copy">
                    <p className="coin-summary-symbol">{coin.symbol}</p>
                    <h1>{coin.name}</h1>
                </div>
            </div>

            <div className="coin-summary-stats">
                <article className="coin-stat-card coin-stat-card-change">
                    <p className="coin-stat-label">24h Change</p>
                    <div className="coin-change-row">
                        <div className={`coin-change-pill ${isPositive ? "" : "coin-change-pill-negative"}`}>
                            {priceChangePercentage.toFixed(2)}%
                        </div>
                        <div className={`coin-change-icon ${isPositive ? "" : "coin-change-icon-negative"}`}>
                            {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        </div>
                    </div>
                </article>

                <article className="coin-stat-card coin-stat-card-price">
                    <p className="coin-stat-label">Current Price</p>
                    <p className={`coin-stat-value ${isPositive ? "coin-stat-value-positive" : "coin-stat-value-negative"}`}>
                        {formatCurrency(coin.current_price)}
                    </p>
                </article>

                <article className="coin-stat-card coin-stat-card-volume">
                    <p className="coin-stat-label">Total Volume</p>
                    <p className="coin-stat-value">{formatCurrency(coin.total_volume)}</p>
                </article>

                <article className="coin-stat-card coin-stat-card-market">
                    <p className="coin-stat-label">Market Cap</p>
                    <p className="coin-stat-value">{formatCurrency(coin.market_cap)}</p>
                </article>
            </div>
        </section>
    );
};

export default CoinSummaryCard;
