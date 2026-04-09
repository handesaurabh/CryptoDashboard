import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { color } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material';
import Grid from '../Grid/Grid';
import "./style.css"
import List from '../List/List';

export default function Tabs({ coins }) {
    const [value, setValue] = useState('grid');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const style = {
        color: 'var(--white)',
        width: '50vw',
        fontSize: "1.2rem",
        fontWeight: 500,
        fontFamily: "'Funnel Display', sans-serif",
        textTransform: 'capitalize'
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#00FFF7',
            }
        }
    })

    return (
        <ThemeProvider theme={theme} value={value}>
            <TabContext value={value}>
                <div>
                    <TabList value={value} onChange={handleChange} variant="fullWidth">
                        <Tab label="Grid" value="grid" sx={style} />
                        <Tab label="List" value="list" sx={style} />
                    </TabList>
                </div>
                <TabPanel value="grid">
                    <div className='grid-flex'>
                        {coins.map((coin, i) => {
                            return (
                                <Grid key={i} coin={coin} index={i} />
                            )
                        })}
                    </div>
                </TabPanel>
                <TabPanel value="list">
                    <table className='list-table'>
                        <tbody>
                            {coins.map((item, i) => (
                                <List key={i} coin={item} index={i} />
                            ))}
                        </tbody>
                    </table>
                </TabPanel>
            </TabContext>
        </ThemeProvider>
    );
}
