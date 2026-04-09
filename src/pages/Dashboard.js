import React, { useEffect, useState } from 'react'
import Header from '../components/Common/Header'
import Tabs from '../components/Dashboard/Tabs'
import Search from '../components/Dashboard/Search/Search';
import Pagination from '../components/Dashboard/Pagination/Pagination';
import Loader from '../components/Common/Loader/Loader';
import BackToTop from '../components/Common/BackToTop/BackToTop';
import { getCoinList } from '../functions/getCoinList';

const Dashboard = () => {
    const [coins, setCoins] = useState([]);
    const [pagenatedCoins, setPagenatedCoins] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const handlePageChange = (event, value) => {
        setPage(value);
        var previousIndex = (value - 1) * 10;
        setPagenatedCoins(coins.slice(previousIndex, previousIndex + 10));
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    }

    var filteredCoins = coins.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const loadCoins = async () => {
            const marketCoins = await getCoinList();

            setCoins(marketCoins);
            setPagenatedCoins(marketCoins.slice(0, 10));
            setLoading(false);
        };

        loadCoins();
    }, [])

    useEffect(() => {
        var previousIndex = (page - 1) * 10;
        setPagenatedCoins(coins.slice(previousIndex, previousIndex + 10));
    }, [page, coins]);

    return (
        <>
            <Header />
            <BackToTop />
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <Search search={search} onSearchChange={onSearchChange} />
                    <Tabs coins={search ? filteredCoins : pagenatedCoins} />
                    {!search && (
                        <Pagination page={page} handleChange={handlePageChange} />
                    )}
                </div>
            )}
        </>
    )
}

export default Dashboard;
