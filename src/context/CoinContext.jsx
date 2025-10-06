import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = ({ children }) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  const fetchAllCoin = async () => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched coins:", data);

      // ensure data is always an array
      setAllCoin(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching coins:", error);
      setAllCoin([]); // fallback to empty array
    }
  };

  // Refetch whenever currency changes
  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
