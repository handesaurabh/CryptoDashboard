import React, { useState, useEffect } from 'react'
import "./List.css"
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip } from '@mui/material';
import { convertNumbers } from '../../../functions/convertNumbers';
import { useNavigate } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../../functions/watchlistUtils';

const List = ({ coin, index, isClickable = true }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [inWatchlist, setInWatchlist] = useState(false);
    const navigate = useNavigate();
    const priceChangePercentage = Number(coin.price_change_percentage_24h || 0);
    const isPositive = priceChangePercentage > 0;

    useEffect(() => {
        setInWatchlist(isInWatchlist(coin.id));
    }, [coin.id]);

    const handleNavigation = () => {
        if (!isClickable) return;
        navigate(`/coin/${coin.id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigation();
        }
    };

    const handleWatchlistClick = (e) => {
        e.stopPropagation();
        if (inWatchlist) {
            removeFromWatchlist(coin.id);
        } else {
            addToWatchlist(coin);
        }
        setInWatchlist(!inWatchlist);
    };

    const handleWatchlistKeyDown = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <tr
            className={`list-row ${isClickable ? "list-row-clickable" : "list-row-static"}`}
            onClick={isClickable ? handleNavigation : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            role={isClickable ? "link" : undefined}
            tabIndex={isClickable ? 0 : undefined}
        >
            <td className="td-image">
                <img src={coin.image} className="logo" alt="CoinLogo" />
            </td>
            <td className="coin-identity-cell">
                <div className="name-col">
                    <p className="symbol">{coin.symbol}</p>
                    <p className="name">{coin.name}</p>
                </div>
            </td>

            <Tooltip title="24h Percentage Change" arrow>
                <td className="coin-change-cell">
                    {!isClickable && <p className="detail-label">24h Change</p>}
                    <div className={`price-chip ${!isPositive ? "chip-red" : ""}`}>
                        {priceChangePercentage.toFixed(2)}%
                    </div>
                </td>
            </Tooltip>

            <td className="coin-trend-cell">
                <div className={`trend-icon ${!isPositive ? "red-icon" : ""}`}>
                    {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                </div>
            </td>

            <Tooltip title="Current Price" arrow>
                <td className="coin-price-cell">
                    {!isClickable && <p className="detail-label">Current Price</p>}
                    <h3
                        className="coin-price td-center"
                        style={{ color: isPositive ? "var(--green)" : "var(--red)" }}
                    >
                        Rs. {Number(coin.current_price || 0).toLocaleString()}
                    </h3>
                </td>
            </Tooltip>

            <Tooltip title="Total Volume" arrow>
                <td className="coin-volume-cell">
                    {!isClickable && <p className="detail-label">Total Volume</p>}
                    <p className="total-vol td-right">
                        Rs. {width < 800 ? convertNumbers(coin.total_volume || 0) : Number(coin.total_volume || 0).toLocaleString()}
                    </p>
                </td>
            </Tooltip>

            <Tooltip title="Market Capitalization" arrow>
                <td className="coin-market-cap-cell">
                    {!isClickable && <p className="detail-label">Market Cap</p>}
                    <p className="market-cap td-right">
                        Rs. {width < 800 ? convertNumbers(coin.market_cap || 0) : Number(coin.market_cap || 0).toLocaleString()}
                    </p>
                </td>
            </Tooltip>

            <Tooltip title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"} arrow>
                <td className="coin-watchlist-cell">
                    <button
                        type="button"
                        className={`watchlist-button ${inWatchlist ? "watchlist-button-active" : ""}`}
                        onClick={handleWatchlistClick}
                        onKeyDown={handleWatchlistKeyDown}
                        aria-label={inWatchlist ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
                    >
                        {inWatchlist ? (
                            <StarIcon className="watchlist-icon active-watchlist-icon" />
                        ) : (
                            <StarBorderIcon className="watchlist-icon" />
                        )}
                    </button>
                </td>
            </Tooltip>
        </tr>
    )
}

export default List;
