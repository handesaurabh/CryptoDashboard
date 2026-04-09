import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';
import "./Pagination.css";

export default function PaginationControlled({ page, handleChange }) {
    const isCompact = useMediaQuery("(max-width:640px)");

    return (
        <div className='pagination-container'>
            <div className='pagination-scroll'>
                <Pagination
                    count={10}
                    page={page}
                    onChange={(event, value) => handleChange(event, value)}
                    size={isCompact ? "small" : "medium"}
                    siblingCount={isCompact ? 0 : 1}
                    boundaryCount={isCompact ? 1 : 2}
                    sx={{
                        color: "#fff",
                        "& .MuiPagination-ul": {
                            flexWrap: "nowrap",
                        },
                        "& .MuiPaginationItem-root": {
                            minWidth: isCompact ? "2.15rem" : "2.5rem",
                            height: isCompact ? "2.15rem" : "2.5rem",
                            borderRadius: "999px",
                            fontWeight: 600,
                        },
                        "& .Mui-selected , .Mui-selected:hover": {
                            backgroundColor: "var(--cyan) !important",
                            color: "#111 !important",
                            borderColor: "var(--blue) !important",
                            boxShadow: "0 10px 22px rgba(0, 212, 255, 0.2)",
                        },
                        "& .MuiPaginationItem-ellipsis": {
                            border: "0px solid var(--grey) !important",
                        },
                        "& .MuiPaginationItem-text": {
                            color: "var(--white)",
                            border: "1px solid #333",
                        },
                    }}
                />
            </div>
        </div>
    );
}
