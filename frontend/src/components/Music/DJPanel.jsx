import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCompactDisc, FaBullhorn, FaBolt, FaBackward, FaPalette, FaVolumeUp, FaRedo, FaLightbulb, FaDrum, FaWaveSquare, FaCloudShowersHeavy, FaWater, FaMagic } from 'react-icons/fa';

const DJPanel = ({
    onSpeedChange,
    onFilterChange,
    onEQChange,
    onVolumeChange,
    onLoopToggle,
    onLightChange,
    onReverbChange,
    onDelayChange,
    onSamplerTrigger,
    onVisualizerChange,
    onPhaserChange,
    onNatureEffect,
    onPartyPop,
    onDistortionChange,
    onPanChange
}) => {
    // const [isOpen, setIsOpen] = useState(true); // Default open for persistent panel
    const [volume, setVolume] = useState(1);
    const [eq, setEq] = useState({ low: 0, mid: 0, high: 0 });
    const [isLooping, setIsLooping] = useState(false);
    const [lightMode, setLightMode] = useState('off');
    const [lightColor, setLightColor] = useState('#ff00ff');
    const [lightSpeed, setLightSpeed] = useState(1); // eslint-disable-line

    // New State
    const [reverb, setReverb] = useState(0);
    const [delay, setDelay] = useState(0);
    const [phaser, setPhaser] = useState(0);
    const [distortion, setDistortion] = useState(0);
    const [pan, setPan] = useState(0);
    const [visualizerMode, setVisualizerMode] = useState('bar');

    const audioContextRef = useRef(null);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Effect to propagate light changes
    useEffect(() => {
        if (onLightChange) {
            onLightChange({ mode: lightMode, color: lightColor, speed: lightSpeed });
        }
    }, [lightMode, lightColor, lightSpeed, onLightChange]);

    const playEffect = (type) => {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;
        if (audioContext.state === 'suspended') audioContext.resume();

        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;

        if (type === 'airhorn') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'scratch') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.1);
            osc.frequency.linearRampToValueAtTime(800, now + 0.2);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'laser') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'rewind') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'damnson') {
            const osc2 = audioContext.createOscillator();
            osc.type = 'triangle';
            osc2.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc2.frequency.setValueAtTime(300, now);

            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            gain2.gain.setValueAtTime(0.3, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            osc.start(now);
            osc2.start(now);
            osc.stop(now + 0.8);
            osc2.stop(now + 0.8);
        }
    };

    const handleEqChange = (band, value) => {
        const newEq = { ...eq, [band]: parseFloat(value) };
        setEq(newEq);
        if (onEQChange) onEQChange(newEq);
    };

    const handleEqPreset = (type) => {
        let newEq = { low: 0, mid: 0, high: 0 };
        if (type === 'bass') newEq = { low: 5, mid: 0, high: -2 };
        else if (type === 'vocal') newEq = { low: -2, mid: 5, high: 2 };
        else if (type === 'crisp') newEq = { low: 0, mid: 2, high: 5 };
        else if (type === 'flat') newEq = { low: 0, mid: 0, high: 0 };

        setEq(newEq);
        if (onEQChange) onEQChange(newEq);
    };

    return (
        <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 shadow-2xl p-4 text-white"
        >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">

                {/* Logo / Header */}
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-lg">
                        <FaCompactDisc className="text-2xl animate-spin-slow" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Pro DJ Panel</h2>
                        <p className="text-xs text-gray-400">Master Control</p>
                    </div>
                </div>

                {/* Main Controls: Volume, Speed, Filter */}
                <div className="flex items-center gap-6 flex-1 justify-center border-r border-gray-700 pr-6">
                    <div className="flex flex-col items-center w-24">
                        <label className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FaVolumeUp /> Volume</label>
                        <input
                            type="range" min="0" max="1" step="0.01" value={volume}
                            onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                if (onVolumeChange) onVolumeChange(parseFloat(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>
                    <div className="flex flex-col items-center w-24">
                        <label className="text-xs text-gray-400 mb-1">Speed</label>
                        <input
                            type="range" min="0.5" max="2" step="0.1" defaultValue="1"
                            onChange={(e) => onSpeedChange && onSpeedChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            style={{ writingMode: 'bt-lr' }}
                        />
                    </div>
                    <div className="flex flex-col items-center w-24">
                        <label className="text-xs text-gray-400 mb-1">Filter</label>
                        <input
                            type="range" min="0" max="20000" step="100" defaultValue="20000"
                            onChange={(e) => onFilterChange && onFilterChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>
                </div>

                {/* EQ Controls */}
                <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
                    <div className="flex flex-col items-center h-24 justify-between py-1">
                        <input
                            type="range" min="-10" max="10" step="1" value={eq.high}
                            onChange={(e) => handleEqChange('high', e.target.value)}
                            className="h-16 w-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 -rotate-90"
                            style={{ WebkitAppearance: 'slider-vertical' }}
                        />
                        <span className="text-[10px] text-gray-400">HI</span>
                    </div>
                    <div className="flex flex-col items-center h-24 justify-between py-1">
                        <input
                            type="range" min="-10" max="10" step="1" value={eq.mid}
                            onChange={(e) => handleEqChange('mid', e.target.value)}
                            className="h-16 w-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 -rotate-90"
                            style={{ WebkitAppearance: 'slider-vertical' }}
                        />
                        <span className="text-[10px] text-gray-400">MID</span>
                    </div>
                    <div className="flex flex-col items-center h-24 justify-between py-1">
                        <input
                            type="range" min="-10" max="10" step="1" value={eq.low}
                            onChange={(e) => handleEqChange('low', e.target.value)}
                            className="h-16 w-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 -rotate-90"
                            style={{ WebkitAppearance: 'slider-vertical' }}
                        />
                        <span className="text-[10px] text-gray-400">LOW</span>
                    </div>
                </div>

                {/* Spatial Effects & Phaser */}
                <div className="flex flex-col gap-2 border-r border-gray-700 pr-6 w-32">
                    <div className="flex flex-col">
                        <label className="text-[10px] text-gray-400 flex justify-between">Reverb <span>{Math.round(reverb * 100)}%</span></label>
                        <input
                            type="range" min="0" max="1" step="0.05" value={reverb}
                            onChange={(e) => {
                                setReverb(parseFloat(e.target.value));
                                if (onReverbChange) onReverbChange(parseFloat(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] text-gray-400 flex justify-between">Delay <span>{Math.round(delay * 100)}%</span></label>
                        <input
                            type="range" min="0" max="1" step="0.05" value={delay}
                            onChange={(e) => {
                                setDelay(parseFloat(e.target.value));
                                if (onDelayChange) onDelayChange(parseFloat(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] text-gray-400 flex justify-between">Phaser <span>{Math.round(phaser * 100)}%</span></label>
                        <input
                            type="range" min="0" max="1" step="0.05" value={phaser}
                            onChange={(e) => {
                                setPhaser(parseFloat(e.target.value));
                                if (onPhaserChange) onPhaserChange(parseFloat(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                        />
                    </div>
                </div>

                {/* Sampler Pads */}
                <div className="grid grid-cols-2 gap-1 w-24 border-r border-gray-700 pr-6">
                    {['Kick', 'Snare', 'Hat', 'Clap'].map((sound) => (
                        <button
                            key={sound}
                            onMouseDown={() => onSamplerTrigger && onSamplerTrigger(sound.toLowerCase())}
                            className="bg-gray-800 hover:bg-pink-600 active:bg-pink-400 text-[10px] font-bold py-2 rounded transition"
                        >
                            {sound}
                        </button>
                    ))}
                </div>

                {/* Effects & Loop */}
                <div className="grid grid-cols-3 gap-2 w-48">
                    <button onClick={() => playEffect('airhorn')} className="bg-gray-800 hover:bg-red-600 p-2 rounded text-xs font-bold transition flex flex-col items-center">
                        <FaBullhorn /> Airhorn
                    </button>
                    <button onClick={() => playEffect('scratch')} className="bg-gray-800 hover:bg-blue-600 p-2 rounded text-xs font-bold transition flex flex-col items-center">
                        <FaCompactDisc /> Scratch
                    </button>
                    <button onClick={() => playEffect('laser')} className="bg-gray-800 hover:bg-green-600 p-2 rounded text-xs font-bold transition flex flex-col items-center">
                        <FaBolt /> Laser
                    </button>
                    <button
                        onClick={() => {
                            const newLoop = !isLooping;
                            setIsLooping(newLoop);
                            if (onLoopToggle) onLoopToggle(newLoop);
                        }}
                        className={`p-2 rounded text-xs font-bold transition flex flex-col items-center ${isLooping ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-yellow-600'}`}
                    >
                        <FaRedo /> Loop
                    </button>
                    <button onClick={() => playEffect('rewind')} className="bg-gray-800 hover:bg-purple-600 p-2 rounded text-xs font-bold transition flex flex-col items-center">
                        <FaBackward /> Rewind
                    </button>
                    <button onClick={() => playEffect('damnson')} className="bg-gray-800 hover:bg-pink-600 p-2 rounded text-xs font-bold transition flex flex-col items-center">
                        😲 Damn!
                    </button>
                </div>

                {/* Nature & Party Controls */}
                <div className="flex flex-col gap-2 border-l border-gray-700 pl-6 w-32">
                    <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => onNatureEffect && onNatureEffect('thunder')} className="bg-gray-800 hover:bg-yellow-600 p-1 rounded text-[10px] flex justify-center" title="Thunder"><FaBolt /></button>
                        <button onClick={() => onNatureEffect && onNatureEffect('rain')} className="bg-gray-800 hover:bg-blue-600 p-1 rounded text-[10px] flex justify-center" title="Rain"><FaCloudShowersHeavy /></button>
                        <button onClick={() => onNatureEffect && onNatureEffect('ocean')} className="bg-gray-800 hover:bg-cyan-600 p-1 rounded text-[10px] flex justify-center" title="Ocean"><FaWater /></button>
                    </div>
                    <div className="flex gap-1 mt-1">
                        <button onClick={() => onPartyPop && onPartyPop('left')} className="bg-pink-600 hover:bg-pink-500 text-[10px] p-1 rounded flex-1">🎉 L</button>
                        <button onClick={() => onPartyPop && onPartyPop('center')} className="bg-pink-600 hover:bg-pink-500 text-[10px] p-1 rounded flex-1">🎉 C</button>
                        <button onClick={() => onPartyPop && onPartyPop('right')} className="bg-pink-600 hover:bg-pink-500 text-[10px] p-1 rounded flex-1">🎉 R</button>
                    </div>
                </div>

                {/* Master FX (Distortion, Pan, EQ Presets) */}
                <div className="flex flex-col gap-2 border-l border-gray-700 pl-6 w-40">
                    <div className="flex flex-col">
                        <label className="text-[10px] text-gray-400 flex justify-between">Crunch <span>{Math.round(distortion * 100)}%</span></label>
                        <input
                            type="range" min="0" max="1" step="0.05" value={distortion}
                            onChange={(e) => {
                                setDistortion(parseFloat(e.target.value));
                                if (onDistortionChange) onDistortionChange(parseFloat(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] text-gray-400 flex justify-between">Pan <span>{pan}</span></label>
                        <input
                            type="range" min="-1" max="1" step="0.1" value={pan}
                            onChange={(e) => {
                                setPan(parseFloat(e.target.value));
                                if (onPanChange) onPanChange(parseFloat(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-1 mt-1">
                        <button onClick={() => handleEqPreset('bass')} className="bg-gray-800 hover:bg-purple-600 text-[8px] p-1 rounded">BASS</button>
                        <button onClick={() => handleEqPreset('vocal')} className="bg-gray-800 hover:bg-blue-600 text-[8px] p-1 rounded">VOC</button>
                        <button onClick={() => handleEqPreset('crisp')} className="bg-gray-800 hover:bg-yellow-600 text-[8px] p-1 rounded">CRISP</button>
                        <button onClick={() => handleEqPreset('flat')} className="bg-gray-800 hover:bg-gray-600 text-[8px] p-1 rounded">FLAT</button>
                    </div>
                </div>

                {/* Disco Lights & Visualizer Control */}
                <div className="flex flex-col gap-2 border-l border-gray-700 pl-6">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold flex items-center gap-1"><FaLightbulb className="text-yellow-400" /> Lights</span>
                        <select
                            value={lightMode}
                            onChange={(e) => setLightMode(e.target.value)}
                            className="bg-gray-800 text-xs rounded px-1 py-0.5 border border-gray-600 focus:outline-none"
                        >
                            <option value="off">Off</option>
                            <option value="strobe">Strobe</option>
                            <option value="pulse">Pulse</option>
                            <option value="flash">Flash</option>
                            <option value="rgb">RGB</option>
                            <option value="thunder">Thunder</option>
                            <option value="ocean">Ocean</option>
                            <option value="rain">Rain</option>
                        </select>
                    </div>

                    <div className="flex gap-1">
                        {['#e63946', '#4cc9f0', '#f72585', '#4361ee', '#7209b7'].map(color => (
                            <button
                                key={color}
                                onClick={() => setLightColor(color)}
                                className={`w-4 h-4 rounded-full border border-white/50 hover:scale-125 transition ${lightColor === color ? 'ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold flex items-center gap-1"><FaWaveSquare className="text-blue-400" /> Vis</span>
                        <select
                            value={visualizerMode}
                            onChange={(e) => {
                                setVisualizerMode(e.target.value);
                                if (onVisualizerChange) onVisualizerChange(e.target.value);
                            }}
                            className="bg-gray-800 text-xs rounded px-1 py-0.5 border border-gray-600 focus:outline-none"
                        >
                            <option value="bar">Bar</option>
                            <option value="wave">Wave</option>
                            <option value="circle">Circle</option>
                        </select>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default DJPanel;
