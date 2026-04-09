import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./SelectDay.css";

const rangeOptions = [
    { value: 7, label: "7 Days" },
    { value: 30, label: "1 Month" },
    { value: 60, label: "60 Days" },
    { value: 90, label: "90 Days" },
    { value: 180, label: "180 Days" },
    { value: 365, label: "1 Year" },
    { value: "max", label: "All Days" },
];

export default function SelectDays({ days: selectedDays, onDaysChange }) {
    const [localDays, setLocalDays] = useState(30);
    const days = selectedDays ?? localDays;

    const handleChange = (event) => {
        const rawValue = event.target.value;
        const value = rawValue === "max" ? "max" : Number(rawValue);

        setLocalDays(value);

        if (onDaysChange) {
            onDaysChange(value);
        }
    };

    return (
        <div className='select-days-card'>
            <div className='select-days-copy'>
                <p className='select-days-eyebrow'>Chart Range</p>
                <h3>Select your timeframe</h3>
                <p className='select-days-subtext'>Compare short-term momentum or zoom out for the bigger trend.</p>
            </div>
            <FormControl className='select-days-control' size='small'>
                <InputLabel id="coin-days-select-label">Days</InputLabel>
                <Select
                    labelId="coin-days-select-label"
                    id="coin-days-select"
                    value={days}
                    label="Days"
                    onChange={handleChange}
                    className='select-days-dropdown'
                    MenuProps={{
                        PaperProps: {
                            className: 'select-days-menu',
                        },
                    }}
                >
                    {rangeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
