import React from 'react'
import "./Search.css"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Search = ({ search, onSearchChange }) => {
    return (
        <div className='search-flex'>
            <SearchOutlinedIcon />
            <input
                placeholder='Search Here'
                type="text"
                value={search}
                onChange={onSearchChange}
            />
        </div>
    )
}

export default Search
