import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import "./PriceType.css";

export default function PriceType({ priceType, handlePriceTypeChange }) {

    return (
        <div className='price-type-card'>
            <div className='price-type-copy'>
                <p className='price-type-eyebrow'>Data View</p>
                <h3>Choose what the chart should show</h3>
                <p className='price-type-subtext'>Switch between price action, market cap, and total volume with a single tap.</p>
            </div>

            <ToggleButtonGroup
                value={priceType}
                exclusive
                onChange={handlePriceTypeChange}
                aria-label="price type selection"
                className='price-type-group'
            >
                <ToggleButton value="prices" className='price-type-btn'>Price</ToggleButton>
                <ToggleButton value="market_caps" className='price-type-btn'>Market Cap</ToggleButton>
                <ToggleButton value="total_volumes" className='price-type-btn'>Total Volume</ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
