window.onload = function() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const sizeInput = document.getElementById('size');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const introVideo = document.getElementById('introVideo');
    const canvasContainer = document.getElementById('canvasContainer');
    const congratulationsPage = document.getElementById('congratulationsPage');
    const continueButton = document.getElementById('continueButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const colorPicker = document.getElementById('colorPicker');

    let drawing = false;
    let size = sizeInput.value;
    let currentColor = colorPicker.value;
    let currentMazeIndex = 0;

    // Maze images array
    const mazeImages = [
        'Images/maze1.png',
        'Images/maze2.png',
        'Images/maze3.png',
        'Images/maze4.png',
        'Images/maze5.png'
    ];

    // Fullscreen maze images array
    const fullscreenMazeImages = [
        'Images/maze1_large.jpg',
        'Images/maze2_large.jpg',
        'Images/maze3_large.jpg',
        'Images/maze4_large.jpg',
        'Images/maze5_large.jpg'
    ];

    // Reference images for correct paths
    const referenceImages = [
        'Images/correctPath1.png',
        'Images/correctPath1.png',
        'Images/correctPath1.png',
        'Images/correctPath1.png',
        'Images/correctPath1.png'
    ];

    const mazeImage = new Image();
    const referenceImage = new Image();

    // Off-screen canvas for storing drawing content
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCtx = offScreenCanvas.getContext('2d');

    // Hide video and show canvas when video ends
    introVideo.addEventListener('ended', showMaze);

    // Update color when color picker value changes
    colorPicker.addEventListener('input', function() {
        currentColor = colorPicker.value;
    });

    function showMaze() {
        introVideo.style.display = 'none';
        canvasContainer.style.display = 'block';
        prevButton.style.display = 'inline-block';
        nextButton.style.display = 'inline-block';
        loadMaze(currentMazeIndex);
    }

    function startDrawing(e) {
        e.preventDefault();
        drawing = true;
        draw(e); // Draw a point at the starting position
    }

    function draw(e) {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let x, y;
        if (e.touches) {
            const touch = e.touches[0];
            x = (touch.clientX - rect.left) * scaleX;
            y = (touch.clientY - rect.top) * scaleY;
        } else {
            x = (e.clientX - rect.left) * scaleX;
            y = (e.clientY - rect.top) * scaleY;
        }

        // Confine the brush to the canvas area
        x = Math.max(0, Math.min(x, canvas.width));
        y = Math.max(0, Math.min(y, canvas.height));

        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        offScreenCtx.lineWidth = size;
        offScreenCtx.lineCap = 'round';
        offScreenCtx.strokeStyle = currentColor;
        offScreenCtx.lineTo(x, y);
        offScreenCtx.stroke();
        offScreenCtx.beginPath();
        offScreenCtx.moveTo(x, y);
    }

    function stopDrawing(e) {
        e.preventDefault();
        drawing = false;
        ctx.beginPath();
        offScreenCtx.beginPath();

        // Check if the user completed the maze correctly
        checkCompletion();
    }

    // Set tool size
    window.setSize = function(newSize) {
        size = newSize;
    };

    // Clear the canvas
    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height);
        offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    };

    // Align brush with mouse pointer
    canvas.addEventListener('mouseenter', () => {
        canvas.style.cursor = 'crosshair';
    });

    // Previous maze
    window.prevMaze = function() {
        if (currentMazeIndex > 0) {
            showCongratulationsPage('prev');
        }
    };

    // Next maze
    window.nextMaze = function() {
        if (currentMazeIndex < mazeImages.length - 1) {
            showCongratulationsPage('next');
        }
    };

    function showCongratulationsPage(direction) {
        canvasContainer.style.display = 'none';
        congratulationsPage.style.display = 'flex';

        continueButton.onclick = function() {
            congratulationsPage.style.display = 'none';
            canvasContainer.style.display = 'block';
            if (direction === 'next') {
                currentMazeIndex++;
                loadMaze(currentMazeIndex);
            } else if (direction === 'prev') {
                currentMazeIndex--;
                loadMaze(currentMazeIndex);
            }
        };
    }

    // Function to detect if the user is on an iOS device
    function isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function toggleFullscreen() {
        if (isIOS()) {
            // Simulate fullscreen by resizing the canvas to fit the screen
            if (!canvas.classList.contains('fullscreen-mode')) {
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.classList.add('fullscreen-mode');
                fullscreenButton.textContent = 'Exit Fullscreen';
                document.getElementById('overlayToolsContainer').style.display = 'flex'; // Show tools in fullscreen
                loadMaze(currentMazeIndex); // Reload the maze image
            } else {
                canvas.style.width = '';
                canvas.style.height = '';
                canvas.classList.remove('fullscreen-mode');
                fullscreenButton.textContent = 'Go Fullscreen';
                document.getElementById('overlayToolsContainer').style.display = 'none'; // Hide tools when exiting fullscreen
                loadMaze(currentMazeIndex); // Reload the maze image
            }
        } else {
            // Standard fullscreen logic
            if (!document.fullscreenElement) {
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen();
                } else if (canvas.webkitRequestFullscreen) { // Safari
                    canvas.webkitRequestFullscreen();
                } else if (canvas.msRequestFullscreen) { // IE11
                    canvas.msRequestFullscreen();
                } else if (canvas.mozRequestFullScreen) { // Firefox
                    canvas.mozRequestFullScreen();
                }
                document.getElementById('overlayToolsContainer').style.display = 'flex'; // Show tools in fullscreen
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { // Safari
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE11
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                }
                document.getElementById('overlayToolsContainer').style.display = 'none'; // Hide tools when exiting fullscreen
            }
        }
    }

    // Handle fullscreen change
    function handleFullscreenChange() {
        if (document.fullscreenElement || canvas.classList.contains('fullscreen-mode')) {
            fullscreenButton.textContent = 'Exit Fullscreen';
        } else {
            fullscreenButton.textContent = 'Go Fullscreen';
        }
        loadMaze(currentMazeIndex); // Reload maze when fullscreen changes
    }

    fullscreenButton.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Load maze image
    function loadMaze(index) {
        mazeImage.src = (document.fullscreenElement || canvas.classList.contains('fullscreen-mode'))
            ? fullscreenMazeImages[index]
            : mazeImages[index];
        referenceImage.src = referenceImages[index]; // Load the corresponding reference image

        mazeImage.onload = function() {
            canvas.width = mazeImage.width;
            canvas.height = mazeImage.height;
            ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height);
            offScreenCanvas.width = mazeImage.width;
            offScreenCanvas.height = mazeImage.height;
            offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
        };
    }

    function checkCompletion() {
        if (!referenceImage.complete) return;
    
        const userImageData = offScreenCtx.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height);
        const referenceCtx = document.createElement('canvas').getContext('2d');
        referenceCtx.canvas.width = referenceImage.width;
        referenceCtx.canvas.height = referenceImage.height;
        referenceCtx.drawImage(referenceImage, 0, 0, offScreenCanvas.width, offScreenCanvas.height);
        const referenceImageData = referenceCtx.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    
        let matchingPathPixels = 0;
        let totalPathPixels = 0;
        const requiredMatchingPercentage = 90; // Lower this for testing, if necessary
    
        const debugCanvas = document.createElement('canvas');
        debugCanvas.width = offScreenCanvas.width;
        debugCanvas.height = offScreenCanvas.height;
        const debugCtx = debugCanvas.getContext('2d');
        debugCtx.drawImage(referenceImage, 0, 0, offScreenCanvas.width, offScreenCanvas.height);
    
        for (let i = 0; i < referenceImageData.data.length; i += 4) {
            const refR = referenceImageData.data[i];
            const refG = referenceImageData.data[i + 1];
            const refB = referenceImageData.data[i + 2];
            const refA = referenceImageData.data[i + 3];
    
            if (refA !== 0) { // Pixel is part of the reference path
                totalPathPixels++;
    
                const userR = userImageData.data[i];
                const userG = userImageData.data[i + 1];
                const userB = userImageData.data[i + 2];
                const userA = userImageData.data[i + 3];
    
                if (
                    userA !== 0 && // User drew on this pixel
                    Math.abs(userR - refR) < 100 && // Increase tolerance
                    Math.abs(userG - refG) < 100 &&
                    Math.abs(userB - refB) < 100
                ) {
                    matchingPathPixels++;
                    debugCtx.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Green
                } else {
                    debugCtx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red
                }
                const x = (i / 4) % offScreenCanvas.width;
                const y = Math.floor((i / 4) / offScreenCanvas.width);
                debugCtx.fillRect(x, y, 1, 1); // Draw a small rectangle over the pixel
            }
        }
    
        const matchingPercentage = (matchingPathPixels / totalPathPixels) * 100;
        console.log('Matching Path Pixels:', matchingPathPixels);
        console.log('Total Path Pixels:', totalPathPixels);
        console.log('Matching Percentage:', matchingPercentage);
    
        offScreenCtx.drawImage(debugCanvas, 0, 0);
    
        if (matchingPercentage >= requiredMatchingPercentage) {
            showCongratulationsPage('next');
        }
    }
    
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // Key bindings for navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevMaze();
        } else if (e.key === 'ArrowRight') {
            nextMaze();
        }
    });
};
