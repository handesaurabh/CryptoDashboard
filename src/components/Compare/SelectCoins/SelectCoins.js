import React from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import "./SelectCoins.css";

const SelectCoins = ({ coins = [], selectedCoins, onCoinsChange }) => {
    const coinIds = new Set(coins.map((coin) => coin.id));
    const hasCoins = coins.length > 0;
    const coin1Value = coinIds.has(selectedCoins?.coin1) ? selectedCoins.coin1 : "";
    const coin2Value = coinIds.has(selectedCoins?.coin2) ? selectedCoins.coin2 : "";

    const handleCoin1Change = (e) => {
        onCoinsChange({
            ...selectedCoins,
            coin1: e.target.value,
        });
    };

    const handleCoin2Change = (e) => {
        onCoinsChange({
            ...selectedCoins,
            coin2: e.target.value,
        });
    };

    return (
        <div className="select-coins-card">
            <div className="select-coins-copy">
                <p className="select-coins-eyebrow">Select Assets</p>
                <h3>Choose two coins to compare</h3>
                <p className="select-coins-subtext">
                    Pick any two cryptocurrencies and track their performance side by side.
                </p>
            </div>

            <div className="select-coins-controls">
                <FormControl className="select-coins-control" fullWidth>
                    <InputLabel>Coin 1</InputLabel>
                    <Select
                        value={coin1Value}
                        label="Coin 1"
                        onChange={handleCoin1Change}
                        className="select-coins-dropdown"
                        MenuProps={{ classes: { paper: "select-coins-menu" } }}
                        disabled={!hasCoins}
                    >
                        <MenuItem value="" disabled>
                            {hasCoins ? "Select coin 1" : "Loading coins..."}
                        </MenuItem>
                        {coins.map((coin) => (
                            <MenuItem
                                key={coin.id}
                                value={coin.id}
                                disabled={coin.id === coin2Value}
                            >
                                {coin.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="select-coins-control" fullWidth>
                    <InputLabel>Coin 2</InputLabel>
                    <Select
                        value={coin2Value}
                        label="Coin 2"
                        onChange={handleCoin2Change}
                        className="select-coins-dropdown"
                        MenuProps={{ classes: { paper: "select-coins-menu" } }}
                        disabled={!hasCoins}
                    >
                        <MenuItem value="" disabled>
                            {hasCoins ? "Select coin 2" : "Loading coins..."}
                        </MenuItem>
                        {coins.map((coin) => (
                            <MenuItem
                                key={coin.id}
                                value={coin.id}
                                disabled={coin.id === coin1Value}
                            >
                                {coin.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export default SelectCoins;
