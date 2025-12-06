import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-10 rounded-3xl max-w-lg w-full border border-white/10"
            >
                <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Get in Touch</h1>
                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Name</label>
                        <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none transition" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input type="email" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none transition" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Message</label>
                        <textarea className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none transition h-32" placeholder="How can we help?"></textarea>
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition transform hover:scale-105 shadow-lg">
                        Send Message
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Contact;
