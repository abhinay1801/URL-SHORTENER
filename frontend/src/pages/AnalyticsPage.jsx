import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UrlContext } from '../context/UrlContext';
import AnalyticsChart from '../components/AnalyticsChart';
import AnalyticsTable from '../components/AnalyticsTable';
import QRCodeModal from '../components/QRCodeModal';

const AnalyticsPage = () => {
  const { shortId } = useParams();
  const { getAnalytics, urls } = useContext(UrlContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const currentUrl = urls.find((url) => url.shortId === shortId);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(shortId);
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shortId) {
      fetchAnalytics();
    }
  }, [shortId, getAnalytics]);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!analytics) return <div className="text-center py-8">No analytics data found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">URL Analytics</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500">Original URL</h3>
              <p className="mt-1 text-sm text-gray-900 break-all">
                <a
                  href={currentUrl?.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {currentUrl?.originalUrl}
                </a>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500">Short URL</h3>
              <p className="mt-1 text-sm text-gray-900">
                <a
                  href={currentUrl?.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {currentUrl?.shortUrl}
                </a>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{analytics.totalClicks}</p>
            </div>
          </div>

          <button
            onClick={() => setShowQRModal(true)}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            View QR Code
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <AnalyticsChart clickData={analytics.analytics} />
        </div>

        <AnalyticsTable clickData={analytics.analytics} />

        {showQRModal && currentUrl && (
          <QRCodeModal
            shortUrl={currentUrl.shortUrl}
            qrCode={currentUrl.qrCode}
            onClose={() => setShowQRModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;