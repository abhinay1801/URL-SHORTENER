import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          URL Shortener
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            {/* <li>
              <Link to="/analytics" className="hover:underline">
                Analytics
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;