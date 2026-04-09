import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import './styles.css';

const Loader = () => {
    return (
        <div className="loader">
            <CircularProgress size={60} style={{ color: 'cyan' }} />
        </div>
    )
}

export default Loader;
