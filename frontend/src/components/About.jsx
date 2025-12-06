import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-10 rounded-3xl max-w-3xl w-full text-center border border-white/10"
            >
                <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">About Us</h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Welcome to the ultimate music experience. Our platform is designed for audiophiles and casual listeners alike, offering a seamless blend of aesthetics and functionality.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                    Built with the latest web technologies, we bring you a "Sunset Glassmorphism" theme that's easy on the eyes and a joy to use. Whether you're curating a playlist or mixing tracks in our DJ Station, we've got you covered.
                </p>
            </motion.div>
        </div>
    );
};

export default About;
