import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FaSearch } from 'react-icons/fa';

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState(localStorage.getItem('username'));

    React.useEffect(() => {
        const handleStorage = () => {
            setUsername(localStorage.getItem('username'));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogout = async () => {
        try {
            // Optional: Call logout API if it exists
            // await api.post('logout/'); 
        } catch (e) {
            console.error(e);
        }
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-8 py-4 flex justify-between items-center border-b border-white/10">
            <Link to="/playlist" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500 flex items-center gap-2">
                <span>🎵</span> Music App
            </Link>

            {/* Search Bar - Only visible if logged in */}
            {username && (
                <div className="relative group w-96 hidden md:block">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-pink-500 transition" />
                    <input
                        type="text"
                        placeholder="Search songs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass text-white pl-12 pr-4 py-2.5 rounded-full border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition placeholder-gray-400 text-sm"
                    />
                </div>
            )}

            <ul className="flex gap-8 items-center">
                <li><Link to="/" className="text-gray-300 hover:text-white transition font-medium relative group">
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition font-medium relative group">
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link></li>

                {username ? (
                    <>
                        <li><Link to="/playlist" className="text-gray-300 hover:text-white transition font-medium relative group">
                            Playlist
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link></li>
                        <li className="text-white font-semibold">Hello, {username}</li>
                        <li>
                            <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition font-medium">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" className="text-gray-300 hover:text-white transition font-medium">Login</Link></li>
                        <li><Link to="/register" className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-primary/50 transition transform hover:scale-105">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
