import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="glass border-t border-white/10 py-8 mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center">
                <div className="text-gray-400 text-sm">
                    &copy; 2025 <strong className="text-pink-500">My Playlist App</strong>. All rights reserved.
                    <br />
                    Developed by <a href="https://github.com/saileshdev" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition">Sailesh</a>
                </div>
                <div className="text-gray-400 text-sm text-right">
                    📞 <a href="tel:+919688748656" className="hover:text-white transition">+91 9688748656</a><br />
                    ✉️ <a href="mailto:sailesh25008@gmail.com" className="hover:text-white transition">sailesh25008@gmail.com</a><br />
                    📍 Coimbatore, Tamil Nadu, India
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="https://www.facebook.com/saileshdev" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-pink-500 transition transform hover:-translate-y-1"><FaFacebookF /></a>
                    <a href="https://www.instagram.com/saileshdev" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-pink-500 transition transform hover:-translate-y-1"><FaInstagram /></a>
                    <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-pink-500 transition transform hover:-translate-y-1"><FaWhatsapp /></a>
                    <a href="https://linkedin.com/in/saileshdev" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-pink-500 transition transform hover:-translate-y-1"><FaLinkedin /></a>
                    <a href="https://github.com/saileshdev" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-pink-500 transition transform hover:-translate-y-1"><FaGithub /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
