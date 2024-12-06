```markdown
# Stockpicker

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [1. Chat API (`/api/chat`)](#1-chat-api-apichat)
  - [2. News API (`/api/news`)](#2-news-api-apinews)
  - [3. Stock Fundamentals API (`/api/stock-fundamentals`)](#3-stock-fundamentals-api-apistock-fundamentals)
- [Components](#components)
  - [Homepage Component](#homepage-component)
  - [StockHomePage Component](#stockhomepage-component)
- [Contexts](#contexts)
  - [GlobalContext](#globalcontext)
  - [TickerContext](#tickercontext)
- [Usage Examples](#usage-examples)
  - [Using the Chat API](#using-the-chat-api)
  - [Using the News API](#using-the-news-api)
  - [Using the Stock Fundamentals API](#using-the-stock-fundamentals-api)
  - [Using the Homepage Component](#using-the-homepage-component)
  - [Using the StockHomePage Component](#using-the-stockhomepage-component)
- [Best Practices](#best-practices)
- [Error Handling](#error-handling)
- [License](#license)
- [Contact](#contact)

## Overview

Stockpicker is a Next.js-based application that provides APIs for interacting with financial data and news. The project includes three primary API endpoints and a set of React components for the frontend interface. Additionally, it leverages Context API for state management across components.

## Technologies Used

- **Next.js**: React framework for building server-side rendered applications and API routes.
- **Vercel**: Platform for deploying and hosting the application.
- **OpenAI**: Leveraging GPT-4 for chat functionalities and Whisper for audio transcription.
- **Formidable**: Handling form data and file uploads.
- **RapidAPI**: Accessing Yahoo Finance APIs for news and stock fundamentals.
- **Node.js**: JavaScript runtime for server-side operations.
- **React**: Front-end library for building user interfaces.
- **Material-UI (MUI)**: UI component library for React.
- **React TradingView Widgets**: Integrating advanced stock charts and trading views.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 14 or higher recommended).
- **npm or yarn**: Package manager for installing dependencies.
- **OpenAI API Key**: Required for accessing GPT-4 and Whisper models.
- **RapidAPI Key**: Required for accessing Yahoo Finance News and Stock Fundamentals APIs.

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/yahu-financials.git
    cd yahu-financials
    ```

2. **Install Dependencies**

    Using npm:

    ```bash
    npm install
    ```

    Or using yarn:

    ```bash
    yarn install
    ```

## Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
OPENAI_API_KEY=your_openai_api_key
RAPIDAPI_KEY=your_rapidapi_key
NEXT_PUBLIC_API_URL=https://yourdomain.com/api/chat
NEXT_PUBLIC_NEWS_API_URL=https://yourdomain.com/api/news
NEXT_PUBLIC_STOCK_FUNDAMENTALS_API_URL=https://yourdomain.com/api/stock-fundamentals
```

- **OPENAI_API_KEY**: Your OpenAI API key.
- **RAPIDAPI_KEY**: Your RapidAPI key for accessing Yahoo Finance APIs.
- **NEXT_PUBLIC_API_URL**: Base URL for the Chat API.
- **NEXT_PUBLIC_NEWS_API_URL**: Base URL for the News API.
- **NEXT_PUBLIC_STOCK_FUNDAMENTALS_API_URL**: Base URL for the Stock Fundamentals API.

## API Endpoints

### 1. Chat API (`/api/chat`)

This endpoint allows users to interact with a chatbot that provides detailed stock analysis and insights. It supports both text and audio inputs.

#### **Request**

- **URL:** `/api/chat`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Body Parameters:**
  - `data` (string, required): JSON string containing the conversation history.
  - `file` (file, optional): Audio file for transcription and processing.

#### **Request Example**

Using `curl`:

```bash
curl -X POST https://yourdomain.com/api/chat \
  -F 'data=[{"role": "user", "content": "Tell me about AAPL stock."}]' \
  -F 'file=@/path/to/audiofile.mp3'
```

#### **Request Body Structure**

```json
[
  {
    "role": "user",
    "content": "Tell me about AAPL stock."
  }
]
```

#### **Response**

- **Content-Type:** `text/plain` (Streamed response)
- **Body:** Streamed text response from the OpenAI GPT-4 model, incorporating any transcribed audio input.

#### **Response Example**

```
AAPL (Apple Inc.) is currently trading at $150.00 per share. The stock has shown a steady growth over the past year, with significant contributions from its latest product launches and strong earnings reports...
```

---

### 2. News API (`/api/news`)

This endpoint fetches the latest financial news articles or specific articles based on provided UUIDs from Yahoo Finance via RapidAPI.

#### **Request**

- **URL:** `/api/news`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body Parameters:**
  - `uuids` (string, optional): A comma-separated string of UUIDs to filter specific news articles. If omitted, the API returns the latest news based on the `snippetCount`.

#### **Request Example**

Using `curl`:

```bash
curl -X POST https://yourdomain.com/api/news \
  -H 'Content-Type: application/json' \
  -d '{"uuids": "uuid1,uuid2,uuid3"}'
```

#### **Request Body Structure**

```json
{
  "uuids": "uuid1,uuid2,uuid3"
}
```

- **`uuids`**: A comma-separated string of UUIDs representing specific news articles. This parameter is optional. If not provided, the API will return the latest news articles based on the `snippetCount`.

#### **Response**

- **Content-Type:** `application/json`
- **Body:** JSON object containing the fetched news articles.

#### **Response Example**

```json
{
  "items": [
    {
      "title": "Apple Releases New iPhone",
      "link": "https://finance.yahoo.com/news/apple-releases-new-iphone-123456789.html",
      "publisher": "Yahoo Finance",
      "uuid": "uuid1",
      "description": "Apple has just released its latest iPhone model, featuring cutting-edge technology and innovative design..."
    },
    {
      "title": "Market Update: Tech Stocks Rally",
      "link": "https://finance.yahoo.com/news/market-update-tech-stocks-rally-987654321.html",
      "publisher": "Yahoo Finance",
      "uuid": "uuid2",
      "description": "Tech stocks have seen a significant rally this week, driven by strong earnings reports and positive market sentiment..."
    }
    // More articles...
  ]
}
```

#### **Error Response Example**

```json
{
  "error": "Error fetching news data"
}
```

---

### 3. Stock Fundamentals API (`/api/stock-fundamentals`)

This endpoint retrieves fundamental financial data for a specific stock symbol from Yahoo Finance via RapidAPI.

#### **Request**

- **URL:** `/api/stock-fundamentals`
- **Method:** `GET`
- **Headers:**
  - `Content-Type: application/json`
- **Query Parameters:**
  - `symbol` (string, required): The stock symbol to retrieve fundamentals for.

#### **Request Example**

Using `curl`:

```bash
curl -X GET 'https://yourdomain.com/api/stock-fundamentals?symbol=AAPL' \
  -H 'Content-Type: application/json'
```

#### **Request Query Parameters**

- **`symbol`**: The stock ticker symbol (e.g., `AAPL` for Apple Inc.).

#### **Response**

- **Content-Type:** `application/json`
- **Body:** JSON object containing the stock's fundamental data, including asset profile, summary profile, and fund profile.

#### **Response Example**

```json
{
  "assetProfile": {
    "companyName": "Apple Inc.",
    "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    // More asset profile data...
  },
  "summaryProfile": {
    "industry": "Consumer Electronics",
    "sector": "Technology",
    "fullTimeEmployees": 147000,
    // More summary profile data...
  },
  "fundProfile": {
    "fundFamily": "Apple Mutual Funds",
    "fundCategory": "Technology",
    // More fund profile data...
  }
  // Additional modules as requested...
}
```

#### **Error Response Example**

```json
{
  "error": "Error fetching stock fundamentals"
}
```

## Components

### Homepage Component

The `Homepage` component serves as the main landing page of the application. It integrates various sections such as Hero, About, Contact, Feature Cards, Video Section, Waiting List, and User Reviews. The component employs lazy loading and error boundaries to enhance performance and reliability.

#### **File Path**

`/components/Homepage.js`

#### **Code Explanation**

```javascript
import React, { Suspense, lazy } from 'react';
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorBoundary from './ErrorBoundary';
import HeroSection from '../homepage/HeroSection';
import FeatureCards from '../homepage/FeatureCards';
import VideoSection from '../homepage/VideoSection';
import WaitingList from '../homepage/WaitingList';
import UserReviews from '../homepage/UserReviews';

// Lazy load About and Contact components
const About = lazy(() => import('../website/About'));
const Contact = lazy(() => import('../website/Contact'));

function LoadingFallback() {
  return <CircularProgress />;
}

const Homepage = () => (
  <Box sx={{ bgcolor: 'background.default' }}>
    <ErrorBoundary fallback={<Typography color="error">Error loading hero section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading about section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading contact section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading feature cards</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <FeatureCards />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading video section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <VideoSection />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading waiting list</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <WaitingList />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading user reviews</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <UserReviews />
      </Suspense>
    </ErrorBoundary>
  </Box>
);

export default Homepage;
```

#### **Key Components and Concepts**

- **React.lazy & Suspense**: 
  - **Purpose**: Implements code-splitting by lazy loading components, which improves the application's performance by reducing the initial load time.
  - **Usage**: The `About` and `Contact` components are lazy-loaded. Each lazy-loaded component is wrapped inside a `Suspense` component that displays a fallback (spinner) while the component is being loaded.
  
- **ErrorBoundary**:
  - **Purpose**: Catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.
  - **Usage**: Each section of the homepage is wrapped inside an `ErrorBoundary` to ensure that if one section fails to load, it doesn't affect the entire page.

- **Material-UI (MUI)**:
  - **Components Used**:
    - `Box`: Serves as a wrapper component for layout.
    - `Typography`: For displaying text, especially in fallback UIs.
    - `CircularProgress`: Displays a loading spinner as a fallback while components are being lazy-loaded.

#### **Component Breakdown**

1. **HeroSection**
   - **Description**: The top section of the homepage, typically containing a prominent message or call-to-action.
   - **Error Handling**: Displays an error message if the HeroSection fails to load.

2. **About**
   - **Description**: Provides information about the application or company.
   - **Lazy Loading**: Loaded lazily to optimize performance.
   - **Error Handling**: Displays an error message if the About section fails to load.

3. **Contact**
   - **Description**: Contains contact information or a contact form.
   - **Lazy Loading**: Loaded lazily to optimize performance.
   - **Error Handling**: Displays an error message if the Contact section fails to load.

4. **FeatureCards**
   - **Description**: Showcases the key features of the application in card formats.
   - **Error Handling**: Displays an error message if the FeatureCards section fails to load.

5. **VideoSection**
   - **Description**: Embeds promotional or explanatory videos.
   - **Error Handling**: Displays an error message if the VideoSection fails to load.

6. **WaitingList**
   - **Description**: Allows users to sign up for a waiting list or newsletter.
   - **Error Handling**: Displays an error message if the WaitingList section fails to load.

7. **UserReviews**
   - **Description**: Displays testimonials or reviews from users.
   - **Error Handling**: Displays an error message if the UserReviews section fails to load.

#### **ErrorBoundary Component**

The `ErrorBoundary` component is crucial for handling errors gracefully in the application. Below is a brief overview of its implementation.

```javascript
// components/ErrorBoundary.js

import React from 'react';
import { Typography } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
```

- **Props**:
  - `fallback`: React element to display when an error is caught.
  - `children`: The child components that may potentially throw errors.

- **Lifecycle Methods**:
  - `getDerivedStateFromError`: Updates state to indicate an error has been caught.
  - `componentDidCatch`: Logs error details for debugging purposes.

---

### StockHomePage Component

The `StockHomePage` component serves as the comprehensive stock analysis dashboard. It integrates various sub-components to provide detailed insights, real-time charts, and actionable recommendations based on the selected stock symbol.

#### **File Path**

`/components/StockHomePage.js`

#### **Code Explanation**

```javascript
import React, { useState, Suspense } from 'react';
import { Typography, Box, Tabs, Tab, Paper, Container, TextField, Button } from '@mui/material';
import ErrorBoundary from '../website/ErrorBoundary';
import LoadingFallback from '../website/LoadingFallback';
import StockAnalysis from './StockAnalysis';
import EarningsInfo from './EarningsInfo';
import StockFundamentals from './StockFundamentals';
import StockStatistics from './Statistics';
import Recommendation from './Recommendation';
import RecentUpdates from './RecentUpdates';
import Analyst from './Analyst';
import StockOptions from './StockOptions';
import StockScreener from './Screeners';
import Insiders from './Insider';
import CustomML from './CustomML'; 
import Ertimur from './Ertimur';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useTicker } from '../contexts/TickerContext';
import dynamic from "next/dynamic";
const SymbolOverviewNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.SymbolOverview),
  {
    ssr: false,
  }
);
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const StockHomePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { ticker, setTicker } = useTicker(); // Access and set ticker from TickerContext
  const { selectedRegion, selectedLanguage } = useGlobalContext(); // Accessing region and language from GlobalContext
  const [inputTicker, setInputTicker] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleInputChange = (event) => {
    setInputTicker(event.target.value);
  };

  const handleTickerSubmit = () => {
    setTicker(inputTicker);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Analysis
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2, boxShadow: 4 }}>
        <ErrorBoundary fallback={<Typography color="error">Error loading stock analysis</Typography>}>
          <Suspense fallback={<LoadingFallback />}>
            <StockAnalysis />
          </Suspense>
        </ErrorBoundary>
      </Paper>

      {ticker && (
        <Paper elevation={3} sx={{ p: 2, mt: 2, boxShadow: 4 }}>
          <AdvancedRealTimeChart theme="light" height={400} width="100%" symbol={ticker}></AdvancedRealTimeChart>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Stock Information Tabs"
          >
            <Tab label="Stock Screener" />
            <Tab label="Earnings Info" />
            <Tab label="Stock Fundamentals" />
            <Tab label="Stock Statistics" />
            <Tab label="Recommendation" />
            <Tab label="Recent Updates" />
            <Tab label="Analyst Reports" />
            <Tab label="Stock Options" />
            <Tab label="Insider Transactions" />
            <Tab label="Custom ML" />
            {/* <Tab label="Ertimur" /> */}
          </Tabs>
          <Box sx={{ p: 3 }}>
            {tabIndex === 0 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock screener</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockScreener />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 1 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading earnings info</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <EarningsInfo ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 2 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock fundamentals</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockFundamentals ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 3 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock statistics</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockStatistics ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 4 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading recommendation</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Recommendation ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 5 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading recent updates</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <RecentUpdates ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 6 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading analyst reports</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Analyst ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 7 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock options</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockOptions ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 8 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading insider transactions</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Insiders ticker={ticker} region={selectedRegion} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 9 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading Custom ML</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomML ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 10 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading Ertimur</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Ertimur ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
          </Box>
        </Paper>
      )}

      {!ticker && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            label="Enter Stock Symbol"
            variant="outlined"
            value={inputTicker}
            onChange={handleInputChange}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleTickerSubmit}>
            Submit
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default StockHomePage;
```

#### **Key Components and Concepts**

- **State Management**:
  - **`tabIndex`**: Manages the currently active tab.
  - **`ticker`**: The stock symbol selected by the user, managed via `TickerContext`.
  - **`inputTicker`**: The current input value for the stock symbol.

- **Context Usage**:
  - **`useTicker`**: Custom hook to access and set the current stock ticker.
  - **`useGlobalContext`**: Custom hook to access global settings like region and language.

- **Dynamic Imports**:
  - **`SymbolOverviewNoSSR`**: Dynamically imports the `SymbolOverview` widget from `react-ts-tradingview-widgets` with server-side rendering disabled.

- **Material-UI (MUI)**:
  - **Components Used**:
    - `Typography`: For headings and text.
    - `Box`: For layout and spacing.
    - `Tabs` and `Tab`: For navigation between different sections.
    - `Paper`: For containing sections with elevation and padding.
    - `Container`: To center content with defined max-width.
    - `TextField` and `Button`: For user input and actions.

- **ErrorBoundary and Suspense**:
  - Each sub-component is wrapped within `ErrorBoundary` and `Suspense` to handle loading states and potential errors gracefully.

- **TradingView Widgets**:
  - **`AdvancedRealTimeChart`**: Embeds a real-time stock chart.
  - **`SymbolOverviewNoSSR`**: Provides a symbol overview without server-side rendering.

#### **Component Breakdown**

1. **StockAnalysis**
   - **Description**: Provides a comprehensive analysis of the selected stock.
   - **Error Handling**: Displays an error message if the StockAnalysis component fails to load.

2. **AdvancedRealTimeChart**
   - **Description**: Displays an advanced real-time chart for the selected stock symbol.
   - **Integration**: Utilizes `react-ts-tradingview-widgets` for rendering interactive charts.

3. **Tabs and Tab Panels**
   - **Description**: Navigates between different sections such as Stock Screener, Earnings Info, Stock Fundamentals, etc.
   - **Error Handling**: Each tab content is wrapped in `ErrorBoundary` and `Suspense` to manage loading and errors.

4. **Individual Tab Components**
   - **StockScreener**: Provides screening tools for stocks.
   - **EarningsInfo**: Displays earnings information for the selected stock.
   - **StockFundamentals**: Shows fundamental financial data.
   - **StockStatistics**: Presents statistical data related to the stock.
   - **Recommendation**: Offers investment recommendations.
   - **RecentUpdates**: Lists recent updates or news related to the stock.
   - **Analyst**: Shows analyst reports and ratings.
   - **StockOptions**: Details available stock options.
   - **Insiders**: Displays insider transactions.
   - **CustomML**: Integrates custom machine learning models for predictions.
   - **Ertimur**: (Commented out) Presumably another custom component.

5. **Ticker Input Section**
   - **Description**: Allows users to input a stock symbol to fetch and display relevant data.
   - **Error Handling**: Not applicable; relies on API endpoints for error handling.

#### **Context Providers**

- **GlobalContext**
  - **Purpose**: Provides global settings like region and language to components.
  
- **TickerContext**
  - **Purpose**: Manages the current stock ticker symbol across the application.

#### **Dynamic Imports and Server-Side Rendering**

- **Dynamic Components**: Components like `SymbolOverviewNoSSR` are dynamically imported with server-side rendering disabled to optimize performance and avoid rendering issues on the server.

## Contexts

Yahu Financials utilizes React's Context API to manage and share state across different components without prop drilling. The application defines two primary contexts: `GlobalContext` and `TickerContext`.

### GlobalContext

The `GlobalContext` manages global settings such as the selected region and language, allowing components to access and modify these preferences seamlessly.

#### **File Path**

`/contexts/GlobalContext.js`

#### **Code Explanation**

```javascript
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
```

#### **Key Components and Concepts**

- **State Management**:
  - **`selectedRegion`**: Represents the currently selected geographical region (default: 'US').
  - **`selectedLanguage`**: Represents the currently selected language (default: 'en-US').

- **Context Provider**:
  - **`GlobalProvider`**: Wraps around components that need access to global settings. Provides state and setter functions for region and language.

- **Custom Hook**:
  - **`useGlobalContext`**: Simplifies access to the context values within components.

#### **Usage Example**

```javascript
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import { Select, MenuItem } from '@mui/material';

const RegionSelector = () => {
  const { selectedRegion, setSelectedRegion } = useGlobalContext();

  const handleChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  return (
    <Select value={selectedRegion} onChange={handleChange}>
      <MenuItem value="US">United States</MenuItem>
      <MenuItem value="UK">United Kingdom</MenuItem>
      <MenuItem value="CA">Canada</MenuItem>
      // Add more regions as needed
    </Select>
  );
};

export default RegionSelector;
```

### TickerContext

The `TickerContext` manages the current stock ticker symbol selected by the user, enabling various components to access and update the ticker seamlessly.

#### **File Path**

`/contexts/TickerContext.js`

#### **Code Explanation**

```javascript
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
```

#### **Key Components and Concepts**

- **State Management**:
  - **`ticker`**: Represents the current stock ticker symbol selected by the user.

- **Context Provider**:
  - **`TickerProvider`**: Wraps around components that need access to the current ticker. Provides state and setter function for the ticker.

- **Custom Hook**:
  - **`useTicker`**: Simplifies access to the context values within components.

#### **Usage Example**

```javascript
import React from 'react';
import { useTicker } from '../contexts/TickerContext';
import { TextField, Button } from '@mui/material';

const TickerInput = () => {
  const { setTicker } = useTicker();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    setTicker(inputValue.toUpperCase());
  };

  return (
    <div>
      <TextField
        label="Enter Stock Ticker"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default TickerInput;
```

## Usage Examples

### Using the Chat API

#### **Example using Fetch API in JavaScript**

```javascript
const formData = new FormData();
formData.append('data', JSON.stringify([
  { role: 'user', content: 'Tell me about AAPL stock.' }
]));
formData.append('file', audioFile); // Optional: Add an audio file

fetch('/api/chat', {
  method: 'POST',
  body: formData,
})
  .then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    reader.read().then(function processText({ done, value }) {
      if (done) {
        console.log('Final Result:', result);
        return;
      }
      result += decoder.decode(value);
      console.log('Received chunk:', decoder.decode(value));
      return reader.read().then(processText);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Using the News API

#### **Example using Fetch API in JavaScript**

```javascript
const requestBody = {
  uuids: 'uuid1,uuid2,uuid3' // Optional: Specify UUIDs to filter news articles
};

fetch('/api/news', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody),
})
  .then(response => response.json())
  .then(data => {
    console.log('News Data:', data);
  })
  .catch(error => {
    console.error('Error fetching news:', error);
  });
```

**Example Request with `curl`:**

```bash
curl -X POST https://yourdomain.com/api/news \
  -H 'Content-Type: application/json' \
  -d '{"uuids": "uuid1,uuid2,uuid3"}'
```

### Using the Stock Fundamentals API

#### **Example using Fetch API in JavaScript**

```javascript
const stockSymbol = 'AAPL'; // Replace with desired stock symbol

fetch(`/api/stock-fundamentals?symbol=${stockSymbol}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
  .then(response => response.json())
  .then(data => {
    console.log('Stock Fundamentals:', data);
  })
  .catch(error => {
    console.error('Error fetching stock fundamentals:', error);
  });
```

**Example Request with `curl`:**

```bash
curl -X GET 'https://yourdomain.com/api/stock-fundamentals?symbol=AAPL' \
  -H 'Content-Type: application/json'
```

### Using the Homepage Component

#### **Example Usage in a Next.js Page**

```javascript
// pages/index.js

import Homepage from '../components/Homepage';

const HomePage = () => {
  return (
    <div>
      <Homepage />
    </div>
  );
};

export default HomePage;
```

#### **Rendering the Homepage**

When navigating to the root URL (`/`), the `Homepage` component renders various sections such as Hero, About, Contact, Feature Cards, Video Section, Waiting List, and User Reviews. Each section is loaded with lazy loading and wrapped in an `ErrorBoundary` to ensure isolated error handling.

#### **Styling and Theming**

The `Homepage` component utilizes Material-UI (MUI) for consistent styling and theming across different sections. The `Box` component from MUI is used as a container with a background color set to the default theme background.

### Using the StockHomePage Component

#### **Example Usage in a Next.js Page**

```javascript
// pages/stock.js

import StockHomePage from '../components/StockHomePage';
import { GlobalProvider } from '../contexts/GlobalContext';
import { TickerProvider } from '../contexts/TickerContext';

const StockPage = () => {
  return (
    <GlobalProvider>
      <TickerProvider>
        <StockHomePage />
      </TickerProvider>
    </GlobalProvider>
  );
};

export default StockPage;
```

#### **Rendering the StockHomePage**

When navigating to `/stock`, the `StockHomePage` component renders a comprehensive stock analysis dashboard. Users can input a stock symbol to retrieve various insights, including real-time charts, earnings information, stock fundamentals, statistics, recommendations, recent updates, analyst reports, stock options, insider transactions, and custom machine learning predictions.

#### **Component Integration**

The `StockHomePage` integrates multiple sub-components, each responsible for a specific aspect of stock analysis. These components are dynamically loaded and wrapped in `ErrorBoundary` and `Suspense` for optimal performance and error management.

#### **User Interaction Flow**

1. **Input Stock Symbol**: Users enter a stock ticker symbol (e.g., `AAPL`) in the input field.
2. **Submit Ticker**: Upon submission, the application fetches and displays relevant data for the entered symbol.
3. **Navigate Tabs**: Users can navigate through different tabs to view various analyses and data points related to the stock.
4. **View Real-Time Chart**: An advanced real-time chart provides dynamic visualizations of stock performance.
5. **Access Detailed Information**: Each tab presents in-depth information, including earnings, fundamentals, statistics, recommendations, and more.

#### **Styling and Theming**

The `StockHomePage` component leverages Material-UI (MUI) for a cohesive and responsive design. Components such as `Container`, `Paper`, `Typography`, `Tabs`, and `Box` are used to structure and style the dashboard effectively.

## Contexts

Yahu Financials utilizes React's Context API to manage and share state across different components without prop drilling. The application defines two primary contexts: `GlobalContext` and `TickerContext`.

### GlobalContext

The `GlobalContext` manages global settings such as the selected region and language, allowing components to access and modify these preferences seamlessly.

#### **File Path**

`/contexts/GlobalContext.js`

#### **Code Explanation**

```javascript
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
```

#### **Key Components and Concepts**

- **State Management**:
  - **`selectedRegion`**: Represents the currently selected geographical region (default: 'US').
  - **`selectedLanguage`**: Represents the currently selected language (default: 'en-US').

- **Context Provider**:
  - **`GlobalProvider`**: Wraps around components that need access to global settings. Provides state and setter functions for region and language.

- **Custom Hook**:
  - **`useGlobalContext`**: Simplifies access to the context values within components.

#### **Usage Example**

```javascript
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import { Select, MenuItem } from '@mui/material';

const RegionSelector = () => {
  const { selectedRegion, setSelectedRegion } = useGlobalContext();

  const handleChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  return (
    <Select value={selectedRegion} onChange={handleChange}>
      <MenuItem value="US">United States</MenuItem>
      <MenuItem value="UK">United Kingdom</MenuItem>
      <MenuItem value="CA">Canada</MenuItem>
      {/* Add more regions as needed */}
    </Select>
  );
};

export default RegionSelector;
```

### TickerContext

The `TickerContext` manages the current stock ticker symbol selected by the user, enabling various components to access and update the ticker seamlessly.

#### **File Path**

`/contexts/TickerContext.js`

#### **Code Explanation**

```javascript
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
```

#### **Key Components and Concepts**

- **State Management**:
  - **`ticker`**: Represents the current stock ticker symbol selected by the user.

- **Context Provider**:
  - **`TickerProvider`**: Wraps around components that need access to the current ticker. Provides state and setter function for the ticker.

- **Custom Hook**:
  - **`useTicker`**: Simplifies access to the context values within components.

#### **Usage Example**

```javascript
import React from 'react';
import { useTicker } from '../contexts/TickerContext';
import { TextField, Button } from '@mui/material';

const TickerInput = () => {
  const { setTicker } = useTicker();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    setTicker(inputValue.toUpperCase());
  };

  return (
    <div>
      <TextField
        label="Enter Stock Ticker"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default TickerInput;
```

## Usage Examples

### Using the Chat API

#### **Example using Fetch API in JavaScript**

```javascript
const formData = new FormData();
formData.append('data', JSON.stringify([
  { role: 'user', content: 'Tell me about AAPL stock.' }
]));
formData.append('file', audioFile); // Optional: Add an audio file

fetch('/api/chat', {
  method: 'POST',
  body: formData,
})
  .then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    reader.read().then(function processText({ done, value }) {
      if (done) {
        console.log('Final Result:', result);
        return;
      }
      result += decoder.decode(value);
      console.log('Received chunk:', decoder.decode(value));
      return reader.read().then(processText);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Using the News API

#### **Example using Fetch API in JavaScript**

```javascript
const requestBody = {
  uuids: 'uuid1,uuid2,uuid3' // Optional: Specify UUIDs to filter news articles
};

fetch('/api/news', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody),
})
  .then(response => response.json())
  .then(data => {
    console.log('News Data:', data);
  })
  .catch(error => {
    console.error('Error fetching news:', error);
  });
```

**Example Request with `curl`:**

```bash
curl -X POST https://yourdomain.com/api/news \
  -H 'Content-Type: application/json' \
  -d '{"uuids": "uuid1,uuid2,uuid3"}'
```

### Using the Stock Fundamentals API

#### **Example using Fetch API in JavaScript**

```javascript
const stockSymbol = 'AAPL'; // Replace with desired stock symbol

fetch(`/api/stock-fundamentals?symbol=${stockSymbol}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
  .then(response => response.json())
  .then(data => {
    console.log('Stock Fundamentals:', data);
  })
  .catch(error => {
    console.error('Error fetching stock fundamentals:', error);
  });
```

**Example Request with `curl`:**

```bash
curl -X GET 'https://yourdomain.com/api/stock-fundamentals?symbol=AAPL' \
  -H 'Content-Type: application/json'
```

### Using the Homepage Component

#### **Example Usage in a Next.js Page**

```javascript
// pages/index.js

import Homepage from '../components/Homepage';

const HomePage = () => {
  return (
    <div>
      <Homepage />
    </div>
  );
};

export default HomePage;
```

#### **Rendering the Homepage**

When navigating to the root URL (`/`), the `Homepage` component renders various sections such as Hero, About, Contact, Feature Cards, Video Section, Waiting List, and User Reviews. Each section is loaded with lazy loading and wrapped in an `ErrorBoundary` to ensure isolated error handling.

#### **Styling and Theming**

The `Homepage` component utilizes Material-UI (MUI) for consistent styling and theming across different sections. The `Box` component from MUI is used as a container with a background color set to the default theme background.

### Using the StockHomePage Component

#### **Example Usage in a Next.js Page**

```javascript
// pages/stock.js

import StockHomePage from '../components/StockHomePage';
import { GlobalProvider } from '../contexts/GlobalContext';
import { TickerProvider } from '../contexts/TickerContext';

const StockPage = () => {
  return (
    <GlobalProvider>
      <TickerProvider>
        <StockHomePage />
      </TickerProvider>
    </GlobalProvider>
  );
};

export default StockPage;
```

#### **Rendering the StockHomePage**

When navigating to `/stock`, the `StockHomePage` component renders a comprehensive stock analysis dashboard. Users can input a stock symbol to retrieve various insights, including real-time charts, earnings information, stock fundamentals, statistics, recommendations, recent updates, analyst reports, stock options, insider transactions, and custom machine learning predictions.

#### **Component Integration**

The `StockHomePage` integrates multiple sub-components, each responsible for a specific aspect of stock analysis. These components are dynamically loaded and wrapped in `ErrorBoundary` and `Suspense` for optimal performance and error management.

#### **User Interaction Flow**

1. **Input Stock Symbol**: Users enter a stock ticker symbol (e.g., `AAPL`) in the input field.
2. **Submit Ticker**: Upon submission, the application fetches and displays relevant data for the entered symbol.
3. **Navigate Tabs**: Users can navigate through different tabs to view various analyses and data points related to the stock.
4. **View Real-Time Chart**: An advanced real-time chart provides dynamic visualizations of stock performance.
5. **Access Detailed Information**: Each tab presents in-depth information, including earnings, fundamentals, statistics, recommendations, and more.

#### **Styling and Theming**

The `StockHomePage` component leverages Material-UI (MUI) for a cohesive and responsive design. Components such as `Container`, `Paper`, `Typography`, `Tabs`, and `Box` are used to structure and style the dashboard effectively.

## Best Practices

- **Security**:
  - Keep your API keys (`OPENAI_API_KEY` and `RAPIDAPI_KEY`) secure and never expose them on the client side.
  - Use environment variables to manage sensitive information.

- **File Management**:
  - Implement cleanup routines to remove uploaded files after processing to save storage space.
  - Ensure the `./uploads` directory has appropriate permissions and sufficient storage.

- **Rate Limiting**:
  - Consider adding rate limiting to prevent abuse of the APIs.
  - Use middleware or external services to manage API rate limits.

- **Logging**:
  - Maintain logs for monitoring and debugging purposes.
  - Use logging libraries or services to capture and manage logs effectively.

- **Error Handling**:
  - Utilize `ErrorBoundary` components to catch and handle errors in React components gracefully.
  - Ensure all API endpoints have robust error handling to provide meaningful feedback to clients.

## Error Handling

All APIs and components include error handling mechanisms to ensure that errors are logged and appropriate responses are returned to the client.

- **Chat API (`/api/chat`)**:
  - Logs errors during request processing.
  - Returns a `500 Internal Server Error` with a message if an error occurs.

- **News API (`/api/news`)**:
  - Logs errors during the fetch operation.
  - Returns a `500 Internal Server Error` with an error message if the news data cannot be fetched.

- **Stock Fundamentals API (`/api/stock-fundamentals`)**:
  - Logs errors during the fetch operation.
  - Returns a `500 Internal Server Error` with an error message if the stock fundamentals data cannot be fetched.

- **Homepage Component**:
  - Each section is wrapped in an `ErrorBoundary` that displays a fallback UI (error message) if the section fails to load.

- **StockHomePage Component**:
  - Each sub-component is wrapped in an `ErrorBoundary` to handle individual errors without affecting the entire dashboard.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or support, feel free to reach out:

- **Email:** tullah@nyit.edu
- **GitHub:** [yourusername](https://github.com/tamzid2001)
```
