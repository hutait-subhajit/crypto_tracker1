"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "./lib/cryptoSlice";
import { Pagination } from "@mui/material";

export default function Home() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  const { coins, loading, error } = useSelector((state) => state.getCrypto);
  console.log(coins, loading, error);

  const [displayCoins, setDisplayCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const itemsPerPage = 20;
  useEffect(() => {
    setDisplayCoins(coins);
  }, [coins]);

  // const handleClickedCoin = (param) => {
  //   let clickedCoin = coins.includes((param))
  //   setDisplayCoins(clickedCoin)
  // }

  const filterCoins = (type) => {
    // const baseData = displayCoins.length ? [...displayCoins] : [...coins];

    // if (!baseData.length) return;

    let sorted = [...coins];
    if (type === 'gainers') sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    else if (type === 'losers') sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    else if (type === 'volume') sorted.sort((a, b) => b.total_volume - a.total_volume);
    setDisplayCoins(sorted);
    setCurrentPage(1);
  };

const sortCoins = (type) => {
  let sorted = [...coins];

  if (type === 'price_l_h') sorted.sort((a, b) => a.current_price - b.current_price);
  else if (type === 'price_h_l') sorted.sort((a, b) => b.current_price - a.current_price);
  else if (type === 'market_cap_l_h') sorted.sort((a, b) => a.market_cap - b.market_cap);
  else if (type === 'market_cap_h_l') sorted.sort((a, b) => b.market_cap - a.market_cap);
  else if (type === 'name_a_z') sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (type === 'name_z_a') sorted.sort((a, b) => b.name.localeCompare(a.name));

  setDisplayCoins(sorted);
  setCurrentPage(1);
};

  // Pagination Logic
  const totalPages = Math.ceil(displayCoins.length / itemsPerPage);
  const paginatedCoins = displayCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="">

      <div className="">
        {
          loading ? <p>loading...</p> : <div className="flex flex-col gap-y-2">
            {
              error ? <p>{error}</p> :
                <div>
                  {
                    displayCoins.length > 0 ? <div className="flex flex-col gap-y-2">
                      <div className="flex gap-x-4 my-2">
                        <div className="flex justify-between p-1 border border-gray-400 w-[15rem]">
                          <p className="w-8">Filter:</p>
                          <select
                            value={selectedFilter}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedFilter(value);
                              setSelectedSort("");
                              if (value === "") {
                                setDisplayCoins(coins);
                                setCurrentPage(1);
                              } else {
                                filterCoins(value);
                              }
                            }}
                            className="w-[11rem]"
                          >
                            <option value="">Choose Filter</option>
                            <option value="gainers">Top Gainers</option>
                            <option value="losers">Top Losers</option>
                            <option value="volume">Market Cap</option>
                          </select>

                        </div>

                        <div className="flex gap-x-4 items-center px-1 border border-gray-400 w-[17rem]">
                          <p className="w-20">Short By:</p>
                          <select
                            value={selectedSort}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedSort(value);
                              setSelectedFilter(""); // Reset filter

                              if (value === "") {
                                // Reset to original data from Redux
                                setDisplayCoins(coins);
                                setCurrentPage(1);
                              } else {
                                sortCoins(value); // Sort normally
                              }
                            }}
                            className="w-[11rem] bg-gray-200 outline-none py-2"
                          >
                            <option value="">Choose Sort</option>
                            <option value="price_l_h">Price low to high</option>
                            <option value="price_h_l">Price high to low</option>
                            <option value="market_cap_l_h">Market Cap low to high</option>
                            <option value="market_cap_h_l">Market Cap high to low</option>
                            <option value="name_a_z">Name A-Z</option>
                            <option value="name_z_a">Name Z-A</option>
                          </select>

                        </div>
                      </div>
                      {
                        paginatedCoins?.map((coin) => {
                          return (
                            <div key={coin.id}
                            // onClick={() => handleClickedCoin(coin?.id)}
                            // className="w-[30rem]"
                            >
                              <Link href={`/${coin.id}`}>
                                <div className="flex gap-x-2 cursor-pointer ">
                                  <img src={coin.image} alt={coin.name} width={25} height={25} />
                                  <h2 className="w-40 truncate">{coin.name}</h2>
                                  <p className="w-20">{coin.symbol}</p>
                                  <p className="w-28">{coin?.current_price}</p>
                                  <p className="w-28">{coin?.total_volume}</p>
                                  <p className={`w-28 ${coin.price_change_percentage_24h < 0 ? "text-red-600" : "text-green-500"}`}>{coin?.price_change_percentage_24h}</p>
                                </div>
                              </Link>

                            </div>
                          );
                        })
                      }
                      <div className="mt-4 flex justify-center">
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          variant="outlined"
                          color="primary"
                        />
                      </div>
                    </div> : <p>nodata</p>
                  }
                </div>
            }
          </div>
        }
      </div>
      {/* <ul>
      {coins.map((coin) => (
        <li key={coin.id}>
          {coin.name} - ${coin.current_price}
        </li>
      ))}
    </ul> */}
    </div >
  );
}
