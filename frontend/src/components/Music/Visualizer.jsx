import React, { useRef, useEffect } from 'react';

const Visualizer = ({ analyser, mode = 'bar' }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (mode === 'bar') {
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];
                    const r = barHeight + (25 * (i / bufferLength));
                    const g = 250 * (i / bufferLength);
                    const b = 50;

                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 1;
                }
            } else if (mode === 'wave') {
                analyser.getByteTimeDomainData(dataArray);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgb(0, 255, 0)';
                ctx.beginPath();

                const sliceWidth = canvas.width * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * canvas.height / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            } else if (mode === 'circle') {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = 100;

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.stroke();

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    const rad = (i * 2 * Math.PI) / bufferLength;
                    const x = centerX + Math.cos(rad) * (radius + barHeight);
                    const y = centerY + Math.sin(rad) * (radius + barHeight);
                    const x_inner = centerX + Math.cos(rad) * radius;
                    const y_inner = centerY + Math.sin(rad) * radius;

                    ctx.strokeStyle = `hsl(${i / bufferLength * 360}, 100%, 50%)`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x_inner, y_inner);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [analyser, mode]);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            className="fixed inset-0 pointer-events-none z-0 opacity-50"
        />
    );
};

export default Visualizer;
