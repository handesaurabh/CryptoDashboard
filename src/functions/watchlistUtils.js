import { showToast } from "./toast";

const WATCHLIST_KEY = "crypto_watchlist";

export const getWatchlist = () => {
    try {
        const watchlist = localStorage.getItem(WATCHLIST_KEY);
        return watchlist ? JSON.parse(watchlist) : [];
    } catch (error) {
        console.error("Error reading watchlist from localStorage:", error);
        return [];
    }
};

export const isInWatchlist = (coinId) => {
    const watchlist = getWatchlist();
    return watchlist.some((coin) => coin.id === coinId);
};

export const addToWatchlist = (coin) => {
    try {
        const watchlist = getWatchlist();

        if (isInWatchlist(coin.id)) {
            showToast(`${coin.name} is already in your watchlist!`, "info");
            return false;
        }

        watchlist.push({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            market_cap: coin.market_cap,
            total_volume: coin.total_volume,
            addedAt: new Date().toISOString(),
        });

        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
        showToast(`${coin.name} added to watchlist!`, "success");
        return true;
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        showToast("Failed to add to watchlist", "error");
        return false;
    }
};

export const removeFromWatchlist = (coinId) => {
    try {
        const watchlist = getWatchlist();
        const coinName = watchlist.find((coin) => coin.id === coinId)?.name;

        const filteredWatchlist = watchlist.filter((coin) => coin.id !== coinId);
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filteredWatchlist));

        showToast(`${coinName} removed from watchlist!`, "success");
        return true;
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        showToast("Failed to remove from watchlist", "error");
        return false;
    }
};

export const clearWatchlist = () => {
    try {
        localStorage.removeItem(WATCHLIST_KEY);
        showToast("Watchlist cleared!", "success");
        return true;
    } catch (error) {
        console.error("Error clearing watchlist:", error);
        showToast("Failed to clear watchlist", "error");
        return false;
    }
};
