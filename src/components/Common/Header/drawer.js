import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AnchorTemporaryDrawer() {
    const [open, setOpen] = useState(false);




    return (
        <div>
            <IconButton onClick={() => setOpen(true)}>
                <MenuOpenRoundedIcon className='link' />
            </IconButton>
            <Drawer
                anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className='drawer-container'>
                    <Link to="/">
                        <p className='link'>Home</p>
                    </Link>
                    <Link to="/compare">
                        <p className='link'>Compare</p>
                    </Link>
                    <Link to="/watchlist">
                        <p className='link'>Watchlist</p>
                    </Link>
                    <Link to="/dashboard">
                        <p className='link'>Dashboard</p>
                    </Link>
                </div>
            </Drawer>
        </div>
    );
}
