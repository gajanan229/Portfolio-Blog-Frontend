import React, { useEffect, useRef } from 'react';

const TvStaticBackground = () => {
    const canvasRef = useRef(null);
    // Use a ref to store the current mouse position.
    const mousePos = useRef({ x: -1000, y: -1000 });
    const BRIGHTNESS_RADIUS = 600; // pixels
    const MAX_BRIGHTNESS_EXTRA = 10; // maximum extra brightness
    // reduce cpu load
    const offscreenCanvasRef = useRef(document.createElement('canvas'));
    const updateInterval = 100; // update every 100ms

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const offscreenCanvas = offscreenCanvasRef.current;
        const offCtx = offscreenCanvas.getContext('2d');
        let animationFrameId;

        // Set canvas size to fill the window
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            offscreenCanvas.width = Math.floor(window.innerWidth / 4);
            offscreenCanvas.height = Math.floor(window.innerHeight / 4);
        };
        setCanvasSize();

        // Update mouse position on mouse move
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const drawStatic = () => {
            const offWidth = offscreenCanvas.width;
            const offHeight = offscreenCanvas.height;
            const imageData = offCtx.createImageData(offWidth, offHeight);
            const data = imageData.data;

            // Compute a scale factor to adjust mouse coordinates for offscreen canvas.
            const scaleFactor = 4;
            const scaledMouseX = mousePos.current.x / scaleFactor;
            const scaledMouseY = mousePos.current.y / scaleFactor;
            const offBrightnessRadius = BRIGHTNESS_RADIUS / scaleFactor;

            for (let i = 0; i < data.length; i += 4) {
                // Calculate offscreen pixel coordinates
                const pixelIndex = i / 4;
                const x = pixelIndex % offWidth;
                const y = Math.floor(pixelIndex / offWidth);

                // Generate subtle noise
                const noise = (Math.random() - 0.5) * 2;
                const dx = x - scaledMouseX;
                const dy = y - scaledMouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                let extra = 0;
                if (distance < offBrightnessRadius) {
                extra = ((offBrightnessRadius - distance) / offBrightnessRadius) * MAX_BRIGHTNESS_EXTRA;
                }
                data[i] = Math.min(255, Math.max(0, 16 + noise + extra));   // Red (base: 16)
                data[i + 1] = Math.min(255, Math.max(0, 24 + noise + extra)); // Green (base: 24)
                data[i + 2] = Math.min(255, Math.max(0, 40 + noise + extra)); // Blue (base: 40)
                data[i + 3] = 255; // Alpha
            }

            offCtx.putImageData(imageData, 0, 0);
            // Draw the offscreen canvas onto the main canvas, scaling it up.
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
    };

    // Use setInterval to update the static every 100ms.
    const intervalId = setInterval(drawStatic, updateInterval);

    const handleResize = () => setCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
    };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                backgroundColor: '#101828',
            }}
        />
    );
};

export default TvStaticBackground;