import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL ='http://localhost:5000/api/url';

  const shortenUrl = async (originalUrl, customAlias = '', expiresIn = '') => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/shorten`, {
        originalUrl,
        customAlias,
        expiresIn
      });
      setUrls([response.data, ...urls]);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
      setLoading(false);
      throw err;
    }
  };

  const getAnalytics = async (shortId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/analytics/${shortId}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
      setLoading(false);
      throw err;
    }
  };

  const getAllUrls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/analytics`);
      setUrls(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch URLs');
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUrls();
  }, []);

  return (
    <UrlContext.Provider
      value={{
        urls,
        loading,
        error,
        shortenUrl,
        getAnalytics,
        getAllUrls
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export { UrlContext, UrlProvider };