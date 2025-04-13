import ShortenerForm from '../components/ShortenerForm';
import UrlList from '../components/UrlList';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">URL Shortener</h1>
        <ShortenerForm />
        <UrlList />
      </div>
    </div>
  );
};

export default HomePage;