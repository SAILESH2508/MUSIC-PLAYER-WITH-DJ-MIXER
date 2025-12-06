import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { motion } from 'framer-motion';

const SongForm = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [duration, setDuration] = useState('');
    const [image, setImage] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            api.get(`songs/${id}/`)
                .then(res => {
                    setTitle(res.data.title);
                    setArtist(res.data.artist);
                    setAlbum(res.data.album);
                    setDuration(res.data.duration);
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        formData.append('duration', duration);
        if (image) formData.append('image', image);
        if (songFile) formData.append('song_file', songFile);

        try {
            if (id) {
                await api.put(`songs/${id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('songs/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/playlist');
        } catch (err) {
            setError('Failed to save song. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-10 rounded-3xl max-w-lg w-full border border-white/10"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                    {id ? 'Edit Song' : 'Add New Song'}
                </h2>
                {error && <p className="text-red-400 mb-4 bg-red-900/20 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none" required />
                    <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none" required />
                    <input type="text" placeholder="Album" value={album} onChange={(e) => setAlbum(e.target.value)} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none" />
                    <input type="text" placeholder="Duration (e.g. 3:45)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none" />

                    <div className="text-gray-300 text-sm">Cover Image</div>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600" />

                    <div className="text-gray-300 text-sm">Song File</div>
                    <input type="file" onChange={(e) => setSongFile(e.target.files[0])} className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600" />

                    <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition transform hover:scale-105 shadow-lg mt-4">
                        {id ? 'Update Song' : 'Add Song'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SongForm;
