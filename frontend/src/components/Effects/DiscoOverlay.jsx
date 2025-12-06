import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DiscoOverlay = ({ mode, color, speed, isActive }) => {
    if (!isActive) return null;

    const getAnimation = () => {
        switch (mode) {
            case 'strobe':
                return {
                    opacity: [0, 0.8, 0],
                    transition: { duration: 1 / speed, repeat: Infinity }
                };
            case 'pulse':
                return {
                    opacity: [0.1, 0.6, 0.1],
                    scale: [1, 1.05, 1],
                    transition: { duration: 2 / speed, repeat: Infinity }
                };
            case 'flash':
                return {
                    opacity: [0, 1, 0],
                    transition: { duration: 0.5 / speed, repeat: Infinity, repeatDelay: 0.5 }
                };
            case 'rgb':
                return {
                    backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00'],
                    opacity: 0.3,
                    transition: { duration: 3 / speed, repeat: Infinity }
                };
            case 'thunder':
                return {
                    backgroundColor: '#ffffff',
                    opacity: [0, 1, 0, 0.5, 0],
                    transition: { duration: 0.2, repeat: Infinity, repeatDelay: 2 }
                };
            case 'ocean':
                return {
                    backgroundColor: '#0077be',
                    opacity: [0.2, 0.4, 0.2],
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                };
            case 'rain':
                return {
                    backgroundColor: '#4a69bd',
                    opacity: 0.3,
                    // Rain effect usually needs particles, but for overlay we'll just do a moody tint
                    // A more complex rain effect would require a separate component or canvas
                };
            default:
                return { opacity: 0 };
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 pointer-events-none z-[40]"
                style={{
                    backgroundColor: ['rgb', 'thunder', 'ocean', 'rain'].includes(mode) ? undefined : color,
                    mixBlendMode: mode === 'thunder' ? 'screen' : 'overlay',
                }}
                animate={getAnimation()}
            />
            {mode === 'rain' && (
                <div className="fixed inset-0 pointer-events-none z-[40] bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20 animate-rain"></div>
            )}
        </AnimatePresence>
    );
};

export default DiscoOverlay;
