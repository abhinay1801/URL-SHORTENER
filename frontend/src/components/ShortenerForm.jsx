import { useState, useContext } from 'react';
import { UrlContext } from '../context/UrlContext';
import QRCodeModal from './QRCodeModal';

const ShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { shortenUrl } = useContext(UrlContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await shortenUrl(originalUrl, customAlias, expiresIn);
      setShortUrl(result);
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresIn('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
            Enter URL to shorten
          </label>
          <input
            type="url"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
            Custom alias (optional)
          </label>
          <input
            type="text"
            id="customAlias"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="my-custom-link"
          />
        </div>

        <div>
          <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700">
            Expires in (days, optional)
          </label>
          <input
            type="number"
            id="expiresIn"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="7"
            min="1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Shorten URL
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Your shortened URL</h3>
          <div className="mt-2 flex">
            <input
              type="text"
              value={shortUrl.shortUrl}
              readOnly
              className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl.shortUrl)}
              className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setShowQRModal(true)}
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Generate QR Code
          </button>
        </div>
      )}

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