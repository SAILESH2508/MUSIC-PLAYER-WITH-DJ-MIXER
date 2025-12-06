import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCompactDisc, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import api from '../../api';

import DJPanel from './DJPanel';
import Visualizer from './Visualizer';
import DiscoOverlay from '../Effects/DiscoOverlay';

const SongCarousel = ({ searchTerm }) => {
    const navigate = useNavigate();
    const [allSongs, setAllSongs] = useState([]);
    // const [searchTerm, setSearchTerm] = useState(''); // Moved to App.jsx

    // Derived state for filtered songs
    const songs = allSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [favorites, setFavorites] = useState([]);

    // Player State
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // DJ State
    // const [showDJPanel, setShowDJPanel] = useState(true); // Always true now
    const [lightState, setLightState] = useState({ mode: 'off', color: '#ff00ff', speed: 1 });
    const [isLooping, setIsLooping] = useState(false);
    const [visualizerMode, setVisualizerMode] = useState('bar');

    const audioRef = useRef(new Audio());

    // Web Audio API Refs
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const gainNodeRef = useRef(null);
    const analyserRef = useRef(null);
    const [analyser, setAnalyser] = useState(null);

    // EQ Refs
    const lowFilterRef = useRef(null);
    const midFilterRef = useRef(null);
    const highFilterRef = useRef(null);

    // Effects Refs
    const reverbNodeRef = useRef(null);
    const reverbGainNodeRef = useRef(null);
    const delayNodeRef = useRef(null);
    const delayFeedbackNodeRef = useRef(null);
    const delayGainNodeRef = useRef(null);
    const phaserNodeRef = useRef(null);
    const distortionNodeRef = useRef(null);
    const pannerNodeRef = useRef(null);

    useEffect(() => {
        // Load favorites from local storage
        const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavs); // eslint-disable-line
    }, []);

    useEffect(() => {
        api.get('songs/')
            .then(res => {
                setAllSongs(res.data);
            })
            .catch(err => {
                console.error(err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                }
            });
    }, []);

    useEffect(() => {
        if (songs.length > 0) {
            const song = songs[activeIndex];
            if (audioRef.current.src !== song.song_file) {
                audioRef.current.src = song.song_file;
                if (isPlaying) {
                    audioRef.current.play().catch(e => console.error("Play error:", e));
                }
            }
        }
    }, [activeIndex, songs, isPlaying]);

    // Handle Looping
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
        }
    }, [isLooping]);

    // Time Update Listener
    useEffect(() => {
        const audio = audioRef.current;
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const createReverbBuffer = (ctx) => {
        const length = ctx.sampleRate * 2; // 2 seconds
        const decay = 2.0;
        const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
        for (let c = 0; c < 2; c++) {
            const channelData = buffer.getChannelData(c);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return buffer;
    };

    const makeDistortionCurve = (amount) => {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    };

    const setupAudioGraph = () => {
        if (!audioRef.current) return;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = audioContextRef.current;

        if (!sourceNodeRef.current) {
            try {
                sourceNodeRef.current = ctx.createMediaElementSource(audioRef.current);
            } catch {
                return;
            }
        }

        // Create Nodes if not exist
        if (!lowFilterRef.current) {
            lowFilterRef.current = ctx.createBiquadFilter();
            lowFilterRef.current.type = 'lowshelf';
            lowFilterRef.current.frequency.value = 320;
        }
        if (!midFilterRef.current) {
            midFilterRef.current = ctx.createBiquadFilter();
            midFilterRef.current.type = 'peaking';
            midFilterRef.current.frequency.value = 1000;
            midFilterRef.current.Q.value = 0.5;
        }
        if (!highFilterRef.current) {
            highFilterRef.current = ctx.createBiquadFilter();
            highFilterRef.current.type = 'highshelf';
            highFilterRef.current.frequency.value = 3200;
        }

        // Reverb
        if (!reverbNodeRef.current) {
            reverbNodeRef.current = ctx.createConvolver();
            reverbNodeRef.current.buffer = createReverbBuffer(ctx);
            reverbGainNodeRef.current = ctx.createGain();
            reverbGainNodeRef.current.gain.value = 0; // Default dry
        }

        // Delay
        if (!delayNodeRef.current) {
            delayNodeRef.current = ctx.createDelay();
            delayNodeRef.current.delayTime.value = 0.5;
            delayFeedbackNodeRef.current = ctx.createGain();
            delayFeedbackNodeRef.current.gain.value = 0.4;
            delayGainNodeRef.current = ctx.createGain();
            delayGainNodeRef.current.gain.value = 0; // Default dry
        }

        // Phaser
        if (!phaserNodeRef.current) {
            phaserNodeRef.current = ctx.createBiquadFilter();
            phaserNodeRef.current.type = 'allpass';
            phaserNodeRef.current.frequency.value = 1000;
            phaserNodeRef.current.Q.value = 10;
        }

        // Distortion
        if (!distortionNodeRef.current) {
            distortionNodeRef.current = ctx.createWaveShaper();
            distortionNodeRef.current.curve = makeDistortionCurve(0);
            distortionNodeRef.current.oversample = '4x';
        }

        // Panner
        if (!pannerNodeRef.current) {
            pannerNodeRef.current = ctx.createStereoPanner();
            pannerNodeRef.current.pan.value = 0;
        }

        if (!gainNodeRef.current) {
            gainNodeRef.current = ctx.createGain();
            gainNodeRef.current.gain.value = 1;
        }

        if (!analyserRef.current) {
            analyserRef.current = ctx.createAnalyser();
            analyserRef.current.fftSize = 256;
            setAnalyser(analyserRef.current);
        }

        // Disconnect everything
        try {
            sourceNodeRef.current.disconnect();
            lowFilterRef.current.disconnect();
            midFilterRef.current.disconnect();
            highFilterRef.current.disconnect();
            reverbNodeRef.current.disconnect();
            reverbGainNodeRef.current.disconnect();
            delayNodeRef.current.disconnect();
            delayFeedbackNodeRef.current.disconnect();
            delayGainNodeRef.current.disconnect();
            phaserNodeRef.current.disconnect();
            distortionNodeRef.current.disconnect();
            pannerNodeRef.current.disconnect();
            gainNodeRef.current.disconnect();
            analyserRef.current.disconnect();
        } catch { /* ignore disconnect errors */ }

        // Routing:
        // Source -> Distortion -> Low -> Mid -> High -> Phaser -> [Split]

        sourceNodeRef.current.connect(distortionNodeRef.current);
        distortionNodeRef.current.connect(lowFilterRef.current);
        lowFilterRef.current.connect(midFilterRef.current);
        midFilterRef.current.connect(highFilterRef.current);
        highFilterRef.current.connect(phaserNodeRef.current);

        // Dry Path
        phaserNodeRef.current.connect(gainNodeRef.current);

        // Reverb Path
        phaserNodeRef.current.connect(reverbNodeRef.current);
        reverbNodeRef.current.connect(reverbGainNodeRef.current);
        reverbGainNodeRef.current.connect(gainNodeRef.current);

        // Delay Path
        phaserNodeRef.current.connect(delayNodeRef.current);
        delayNodeRef.current.connect(delayFeedbackNodeRef.current);
        delayFeedbackNodeRef.current.connect(delayNodeRef.current); // Feedback loop
        delayNodeRef.current.connect(delayGainNodeRef.current);
        delayGainNodeRef.current.connect(gainNodeRef.current);

        // Master Output: Gain -> Panner -> Analyser -> Dest
        gainNodeRef.current.connect(pannerNodeRef.current);
        pannerNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ctx.destination);
    };

    const togglePlay = () => {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        setupAudioGraph();

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Play error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % songs.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + songs.length) % songs.length);
    };

    const handleSpeedChange = (speed) => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    };

    const handleFilterChange = () => {
        // Placeholder for filter logic if needed
    };

    const handleEQChange = (newEq) => {
        if (lowFilterRef.current) lowFilterRef.current.gain.value = newEq.low * 2;
        if (midFilterRef.current) midFilterRef.current.gain.value = newEq.mid * 2;
        if (highFilterRef.current) highFilterRef.current.gain.value = newEq.high * 2;
    };

    const handleVolumeChange = (vol) => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = vol;
        }
    };

    const handleReverbChange = (amount) => {
        if (reverbGainNodeRef.current) {
            reverbGainNodeRef.current.gain.value = amount;
        }
    };

    const handleDelayChange = (amount) => {
        if (delayGainNodeRef.current) {
            delayGainNodeRef.current.gain.value = amount;
        }
    };

    const handlePhaserChange = (amount) => {
        if (phaserNodeRef.current) {
            phaserNodeRef.current.frequency.value = 1000 + (amount * 2000);
            phaserNodeRef.current.Q.value = amount * 20;
        }
    };

    const handleDistortionChange = (amount) => {
        if (distortionNodeRef.current) {
            distortionNodeRef.current.curve = makeDistortionCurve(amount * 400); // Scale 0-1 to 0-400
        }
    };

    const handlePanChange = (value) => {
        if (pannerNodeRef.current) {
            pannerNodeRef.current.pan.value = value;
        }
    };

    const handleSamplerTrigger = (sound) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (sound === 'kick') {
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (sound === 'snare') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100, now);
            gain.gain.setValueAtTime(0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (sound === 'hat') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(10000, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (sound === 'clap') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        }
    };

    const handleNatureEffect = (type) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;
        const now = ctx.currentTime;

        if (type === 'thunder') {
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + 1.5);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 2);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);

            setLightState({ mode: 'thunder', color: '#ffffff', speed: 1 });
            setTimeout(() => setLightState({ mode: 'off', color: '#ffffff', speed: 1 }), 2000);

        } else if (type === 'rain' || type === 'ocean') {
            const bufferSize = ctx.sampleRate * 5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11;
                b6 = white * 0.115926;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const gain = ctx.createGain();

            if (type === 'ocean') {
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 2);
                gain.gain.linearRampToValueAtTime(0, now + 5);
                setLightState({ mode: 'ocean', color: '#0077be', speed: 1 });
            } else {
                gain.gain.setValueAtTime(0.1, now);
                setLightState({ mode: 'rain', color: '#4a69bd', speed: 1 });
            }

            noise.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);

            setTimeout(() => setLightState({ mode: 'off', color: '#ffffff', speed: 1 }), 5000);
        }
    };

    const handlePartyPop = (direction) => {
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        if (direction === 'left') {
            confetti({ ...defaults, origin: { x: 0, y: 1 }, angle: 60 });
        } else if (direction === 'right') {
            confetti({ ...defaults, origin: { x: 1, y: 1 }, angle: 120 });
        } else {
            confetti({ ...defaults, origin: { x: 0.5, y: 0.5 } });
        }
    };

    const toggleFavorite = (id) => {
        let newFavs;
        if (favorites.includes(id)) {
            newFavs = favorites.filter(fav => fav !== id);
        } else {
            newFavs = [...favorites, id];
        }
        setFavorites(newFavs);
        localStorage.setItem('favorites', JSON.stringify(newFavs));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this song?')) {
            try {
                await api.delete(`songs/${id}/`);
                const newSongs = allSongs.filter(song => song.id !== id);
                setAllSongs(newSongs);
                if (activeIndex >= newSongs.length) setActiveIndex(0);
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden relative pb-64">
            {/* Added pb-64 to prevent footer overlap */}

            {/* Global Disco Overlay */}
            <DiscoOverlay
                mode={lightState.mode}
                color={lightState.color}
                speed={lightState.speed}
                isActive={lightState.mode !== 'off'}
            />

            {/* Permanent DJ Panel */}
            <DJPanel
                onSpeedChange={handleSpeedChange}
                onFilterChange={handleFilterChange}
                onEQChange={handleEQChange}
                onVolumeChange={handleVolumeChange}
                onLoopToggle={setIsLooping}
                onLightChange={setLightState}
                onReverbChange={handleReverbChange}
                onDelayChange={handleDelayChange}
                onSamplerTrigger={handleSamplerTrigger}
                onVisualizerChange={setVisualizerMode}
                onPhaserChange={handlePhaserChange}
                onNatureEffect={handleNatureEffect}
                onPartyPop={handlePartyPop}
                onDistortionChange={handleDistortionChange}
                onPanChange={handlePanChange}
            />

            <Link to="/add-song" className="absolute top-6 right-6 z-50 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold border border-white/20 hover:bg-white/20 transition transform hover:scale-105 flex items-center gap-2">
                <span>➕</span> Add Song
            </Link>

            <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 transition-all duration-1000 scale-110"
                style={{ backgroundImage: `url(${songs[activeIndex]?.image || ''})` }}
            />

            <div className="relative z-10 w-full max-w-5xl h-[600px] flex items-center justify-center perspective-1000">
                <AnimatePresence mode='popLayout'>
                    {songs.length === 0 ? (
                        <div className="text-white text-2xl glass p-8 rounded-xl">No songs found</div>
                    ) : (
                        songs.map((song, index) => {
                            let position = 0;

                            if (index === activeIndex) position = 0;
                            else if (index === (activeIndex - 1 + songs.length) % songs.length) position = -1;
                            else if (index === (activeIndex + 1) % songs.length) position = 1;
                            else position = 2;

                            if (position === 2) return null;

                            const isFav = favorites.includes(song.id);

                            return (
                                <motion.div
                                    key={song.id}
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        x: position * 320,
                                        scale: position === 0 ? 1.1 : 0.8,
                                        opacity: position === 0 ? 1 : 0.4,
                                        zIndex: position === 0 ? 10 : 5,
                                        rotateY: position * -25
                                    }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    className={`absolute w-80 h-[500px] glass rounded-3xl shadow-2xl overflow-hidden cursor-pointer group border border-white/10 ${position === 0 ? 'ring-2 ring-[var(--primary-color)]' : ''}`}
                                    onClick={() => {
                                        if (position !== 0) setActiveIndex(index);
                                    }}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={song.image} alt={song.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    </div>

                                    <div className="p-6 text-center relative -mt-12">
                                        <h3 className="text-2xl font-bold text-white truncate drop-shadow-lg">{song.title}</h3>
                                        <p className="text-gray-300 text-sm mt-1 mb-4">{song.artist}</p>

                                        {/* Integrated Player Controls */}
                                        {position === 0 && (
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-center gap-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                                        className="text-white/70 hover:text-white transition"
                                                    >
                                                        <FaStepBackward />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                                        className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition shadow-lg hover:scale-110"
                                                    >
                                                        {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                        className="text-white/70 hover:text-white transition"
                                                    >
                                                        <FaStepForward />
                                                    </button>
                                                </div>

                                                {/* Seek Bar */}
                                                <div className="w-full flex flex-col gap-1 px-4" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max={duration || 0}
                                                        value={currentTime}
                                                        onChange={handleSeek}
                                                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                                    />
                                                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                                        <span>{formatTime(currentTime)}</span>
                                                        <span>{formatTime(duration)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute top-[-230px] right-4 flex flex-col gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                                                className="text-white p-3 glass rounded-full hover:bg-white/20 transition transform hover:scale-110"
                                            >
                                                {isFav ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-xl" />}
                                            </button>
                                            <Link
                                                to={`/edit-song/${song.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-white p-3 glass rounded-full hover:bg-white/20 transition transform hover:scale-110 flex items-center justify-center"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(song.id); }}
                                                className="text-white p-3 glass rounded-full hover:bg-red-500/50 transition transform hover:scale-110 flex items-center justify-center"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Visualizer */}
            <Visualizer analyser={analyser} mode={visualizerMode} />
        </div>
    );
};

export default SongCarousel;
