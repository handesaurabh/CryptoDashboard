import React, { useState, useEffect } from 'react'
import './Grid.css'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { convertNumbers } from '../../../functions/convertNumbers';
import { Link } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../../functions/watchlistUtils';

const Grid = ({ coin }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [inWatchlist, setInWatchlist] = useState(false);
    const priceChangePercentage = Number(coin.price_change_percentage_24h || 0);
    const isPositive = priceChangePercentage > 0;

    useEffect(() => {
        setInWatchlist(isInWatchlist(coin.id));
    }, [coin.id]);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWatchlistClick = (e) => {
        e.preventDefault();
        if (inWatchlist) {
            removeFromWatchlist(coin.id);
        } else {
            addToWatchlist(coin);
        }
        setInWatchlist(!inWatchlist);
    };

    return (
        <Link to={`/coin/${coin.id}`} style={{ textDecoration: 'none' }}>
            <div className={`grid-container ${isPositive ? "grid-green" : "grid-red"}`}>
                <div className="info">
                    <img src={coin.image} className='logo' alt='CoinLogo' />
                    <div className='name-col'>
                        <p className='symbol'>{coin.symbol}</p>
                        <p className='name'>{coin.name}</p>
                    </div>
                </div>
                <div className="watchlist-icon-grid" onClick={handleWatchlistClick}>
                    {inWatchlist ? (
                        <StarIcon style={{ color: 'var(--blue)' }} />
                    ) : (
                        <StarBorderIcon style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    )}
                </div>
                {isPositive ? (
                    <div className="chip">
                        <div className="price-chip">{priceChangePercentage.toFixed(2)}%</div>
                        <div className='trend-icon'>
                            <div><TrendingUpIcon /></div>
                        </div>
                    </div>
                ) : (
                    <div className="chip">
                        <div className="price-chip chip-red">{priceChangePercentage.toFixed(2)}%</div>
                        <div className='trend-icon red-icon'>
                            <div><TrendingDownIcon /></div>
                        </div>
                    </div>
                )}
                <div className='info-container'>
                    <h3 className='coin-price' style={{ color: isPositive ? "var(--green)" : "var(--red)" }}>Rs. {Number(coin.current_price || 0).toLocaleString()}</h3>
                    <p className='total-vol'>Total Volume: Rs. {width < 800 ? convertNumbers(coin.total_volume || 0) : Number(coin.total_volume || 0).toLocaleString()}</p>
                    <p className='market-cap'>Market Cap: Rs. {width < 800 ? convertNumbers(coin.market_cap || 0) : Number(coin.market_cap || 0).toLocaleString()}</p>
                </div>
            </div>
        </Link>
    )
}

export default Grid
