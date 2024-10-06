// components/stocks/TickerContext.js
import React, { createContext, useState, useContext } from 'react';

// Create context
const TickerContext = createContext();

// Custom hook for easy access to context
export const useTicker = () => {
  return useContext(TickerContext);
};

// Ticker provider component
export const TickerProvider = ({ children }) => {
  const [ticker, setTicker] = useState('');

  return (
    <TickerContext.Provider value={{ ticker, setTicker }}>
      {children}
    </TickerContext.Provider>
  );
};
