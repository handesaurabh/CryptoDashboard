import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import "./Pagination.css";

export default function PaginationControlled({ page, handleChange }) {

    return (
        <div className='pagination-container'>
            <Pagination count={10} page={page} onChange={(event, value) => handleChange(event, value)} sx={{
                color: "#fff",
                "& .Mui-selected , .Mui-selected:hover": {
                    backgroundColor: "var(--cyan) !important",
                    color: "#111 !important",
                    borderColor: "var(--blue) !important",
                },

                "& .MuiPaginationItem-ellipsis": {
                    border: "0px solid var(--grey) !important",
                },
                "& .MuiPaginationItem-text": {
                    color: "var(--white)",
                    border: "1px solid #333",
                },
            }} />
        </div>
    );
}