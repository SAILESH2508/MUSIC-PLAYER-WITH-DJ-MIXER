import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import About from './About';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Hero Section */}
            <div className="min-h-screen flex flex-col items-center justify-center text-center relative">
                {/* Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10 px-4"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-purple-500 drop-shadow-2xl mb-6">
                        Feel the Beat
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Experience music like never before with our immersive glassmorphism player and pro DJ station.
                    </p>
                    <div className="flex gap-6 justify-center">
                        <Link to="/login" className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/50 transition transform hover:scale-105">
                            Start Listening
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* About Section */}
            <About />
        </div>
    );
};

export default Home;
