import React, { useState } from 'react';
import api from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('login/', { username, password });
            localStorage.setItem('username', response.data.username);
            window.dispatchEvent(new Event('storage'));
            navigate('/playlist');
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div
                className="glass p-10 rounded-3xl w-full max-w-md text-center relative z-50 border border-white/20 shadow-2xl"
            >
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">Welcome Back</h2>
                    <p className="text-gray-300">Sign in to continue your musical journey</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                    >
                        <span>⚠️</span> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/50 transition-all duration-300 group-hover:bg-white/10"
                        />
                    </div>
                    <div className="group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/50 transition-all duration-300 group-hover:bg-white/10"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[var(--primary-color)]/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Login</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[var(--primary-color)] hover:text-white font-semibold transition-colors duration-300">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
