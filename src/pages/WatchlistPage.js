import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import BackToTop from "../components/Common/BackToTop/BackToTop";
import Tabs from "../components/Dashboard/Tabs";
import Loader from "../components/Common/Loader/Loader";
import { getWatchlist } from "../functions/watchlistUtils";
import "./WatchlistPage.css";

const WatchlistPage = () => {
    const [watchlistCoins, setWatchlistCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const coins = getWatchlist();
        setWatchlistCoins(coins);
        setLoading(false);
    }, []);

    return (
        <>
            <Header />
            <BackToTop />

            <section className="watchlist-hero">
                <p className="watchlist-hero-eyebrow">Your Watchlist</p>
                <h1>Track your favorite coins</h1>
                <p className="watchlist-hero-copy">
                    Monitor the cryptocurrencies you're most interested in. Add coins from the dashboard to get started.
                </p>
            </section>

            {loading ? (
                <Loader />
            ) : watchlistCoins.length === 0 ? (
                <section className="watchlist-empty">
                    <h2>Your watchlist is empty</h2>
                    <p>Start by adding coins from the dashboard or compared page.</p>
                </section>
            ) : (
                <div>
                    <Tabs coins={watchlistCoins} />
                </div>
            )}
        </>
    );
};

export default WatchlistPage;
