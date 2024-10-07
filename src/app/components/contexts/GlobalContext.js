import React, { createContext, useContext, useState } from 'react';

// Create Contexts for Region and Language
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  return (
    <GlobalContext.Provider value={{ selectedRegion, setSelectedRegion, selectedLanguage, setSelectedLanguage }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook for easier access to the context
export const useGlobalContext = () => useContext(GlobalContext);
