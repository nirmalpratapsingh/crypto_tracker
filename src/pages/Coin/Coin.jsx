import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async (coinId) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-bvtC4jmsVxa8gVAmTvYzrvgu' } };
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCoinData(data);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  const fetchHistoricalData = async (coinId, currency, days = 7) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=${days}&interval=daily`;
    const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-bvtC4jmsVxa8gVAmTvYzrvgu' } };
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    if (coinId && currency) {
      fetchCoinData(coinId);
      fetchHistoricalData(coinId, currency, 7);
    }
  }, [coinId, currency]);

  if (!coinData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className='coin'>
      <div className="coin-name">
        <img src={coinData.image.large} alt={coinData.name} />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>

      <div className="coin-chart">
        {historicalData ? (
          <LineChart historicalData={historicalData} currency={currency} />
        ) : (
          <div className="spinner">
            <div className="spin"></div>
          </div>
        )}
      </div>

      <div className="coin-info">
        <p>Rank: #{coinData.market_cap_rank}</p>
        <p>Current Price: {coinData.market_data.current_price[currency.name]} {currency.symbol}</p>
        <p>Market Cap: {coinData.market_data.market_cap[currency.name].toLocaleString()} {currency.symbol}</p>
        <p>24h Change: {coinData.market_data.price_change_percentage_24h.toFixed(2)}%</p>
      </div>

      {historicalData && (
        <div className="coin-history">
          <p>Showing last 7 days price history in {currency.name.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
};

export default Coin;
