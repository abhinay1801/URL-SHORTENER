import { useState, useContext, useEffect } from 'react';
import { UrlContext } from '../context/UrlContext';
import QRCodeModal from './QRCodeModal';

const ShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { shortenUrl } = useContext(UrlContext);

  useEffect(() => {
    if (error) setError('');
  }, [originalUrl, customAlias, expiresIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await shortenUrl(originalUrl, customAlias, expiresIn);
      setShortUrl(result);
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresIn('');
      setCopied(false);
    } catch (err) {
      setError(err.message || 'Failed to shorten URL. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <h2 className="text-white text-xl font-bold">URL Shortener</h2>
        <p className="text-blue-100 text-sm mt-1">Create shorter, shareable links in seconds</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
                Enter URL to shorten
              </label>
              <span className="text-xs text-gray-500">Required</span>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="url"
                id="originalUrl"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className={`block w-full pr-10 border ${!originalUrl || isValidUrl(originalUrl) ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'border-red-300 focus:ring-red-500 focus:border-red-500'} rounded-md shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none`}
                placeholder="https://example.com/my-long-url"
                required
              />
              {originalUrl && !isValidUrl(originalUrl) && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {originalUrl && !isValidUrl(originalUrl) && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid URL including http:// or https://</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
                  Custom alias
                </label>
                <span className="text-xs text-gray-500">Required</span>
              </div>
              <div className="mt-1">
                <input
                  type="text"
                  id="customAlias"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="my-brand-name"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Create a memorable link (letters, numbers, hyphens only)</p>
            </div>


            <div>
              <div className="flex items-center justify-between">
              <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700">
                Expires in (days)
              </label>
                <span className="text-xs text-gray-500">Required</span>
              </div>
              <input
                type="number"
                id="expiresIn"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="days"
                min="1"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (originalUrl && !isValidUrl(originalUrl))}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading || (originalUrl && !isValidUrl(originalUrl)) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 border border-green-200 rounded-lg overflow-hidden shadow-sm bg-green-50">
            <div className="bg-green-100 px-4 py-3 border-b border-green-200 flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-green-800">Your URL has been shortened!</h3>
            </div>

            <div className="p-4">
              <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</span>
                    <span className="text-xs text-gray-400">Click to visit</span>
                  </div>
                </div>

                <div className="p-3 flex flex-wrap items-center gap-3">
                  <a
                    href={shortUrl.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-lg font-medium flex-grow truncate"
                  >
                    {shortUrl.shortUrl}
                  </a>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopy}
                      aria-label="Copy to clipboard"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${copied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                    >
                      {copied ? (
                        <>
                          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowQRModal(true)}
                      className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    >
                      <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                        <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                      </svg>
                      QR Code
                    </button>
                  </div>
                </div>

                {shortUrl.originalUrl && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Original URL</div>
                    <div className="text-sm text-gray-600 break-all">{shortUrl.originalUrl}</div>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShortUrl(null);
                    setOriginalUrl('');
                    setCustomAlias('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                >
                  Create another shortened URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showQRModal && shortUrl && (
        <QRCodeModal
          shortUrl={shortUrl.shortUrl}
          qrCode={shortUrl.qrCode}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default ShortenerForm;