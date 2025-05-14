"use client"
import React, { use, useEffect, useState } from 'react'
import { FaCaretUp } from "react-icons/fa6";
import Link from 'next/link.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoins } from '../lib/cryptoSlice';

const Navbar = () => {
    const [search, setSearch] = useState('');
    const [displayCoins, setDisplayCoins] = useState([]);

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const dispatch = useDispatch();
     useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

    const data=useSelector((state) => state.getCrypto);

    useEffect(() => {
        if (search.trim() === '') {
            setDisplayCoins([]);
            return;
        }

        const filteredCoins = data?.coins?.filter((coin) =>
            coin?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setDisplayCoins(filteredCoins);
    }, [search, data.coins]);

    const handleClick = () => {
        setSearch('');
        setDisplayCoins([]); // Optional: hide the dropdown after selection
    };

    return (
        <div className='fixed container bg-amber-400 z-50'>
            <div className='px-2 md:px-4 py-2.5 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Coin Track</h2>
                <div className='flex items-center gap-2 relative'>
                    <input
                        type="text"
                        placeholder='Search Coin'
                        className='border border-gray-400 rounded-md px-2 py-1'
                        value={search}
                        onChange={handleChange}
                    />
                    {
                        displayCoins.length > 0 && (
                            <div className='absolute top-9 w-[30rem] right-0 max-h-96 overflow-y-scroll shadow-md bg-white z-50'>
                                {displayCoins.map((coin) => (
                                    <div key={coin.id}>
                                        <Link href={`/${coin.id}`} onClick={handleClick}>
                                            <p className='px-2 py-1 hover:bg-gray-100 cursor-pointer'>
                                                {coin.name}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    {/* <p className='flex gap-0.5'>top gainers <FaCaretUp className='text-green-600' /></p>
                    <p className='flex gap-0.5'>top looser <FaCaretUp className='rotate-180 text-red-600' /></p> */}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
