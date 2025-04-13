import { useContext } from 'react';
import { UrlContext } from '../context/UrlContext';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiBarChart2 } from 'react-icons/fi';

const UrlList = () => {
  const { urls, loading, error } = useContext(UrlContext);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recently Shortened URLs</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {urls.map((url) => (
            <li key={url._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {url.shortUrl}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {url.originalUrl}
                    </a>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Clicks: {url.clicks} • Created: {new Date(url.createdAt).toLocaleDateString()}
                    {url.expiresAt && (
                      <span> • Expires: {new Date(url.expiresAt).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <Link
                    to={`/analytics/${url.shortId}`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Analytics"
                  >
                    <FiBarChart2 size={18} />
                  </Link>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800"
                    title="Open"
                  >
                    <FiExternalLink size={18} />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UrlList;