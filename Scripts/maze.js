window.onload = function() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const sizeInput = document.getElementById('size');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const introVideo = document.getElementById('introVideo');
    const canvasContainer = document.getElementById('canvasContainer');
    const toolsContainer = document.getElementById('toolsContainer');
    const statusBar = document.getElementById('statusBar');
    const progress = document.getElementById('progress');
    const loadingStatus = document.getElementById('loadingStatus');
    const congratulationsPage = document.getElementById('congratulationsPage');
    const continueButton = document.getElementById('continueButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const gameContainer = document.getElementById('gameContainer');
    const colorPicker = document.getElementById('colorPicker');

    let drawing = false;
    let size = sizeInput.value;
    let currentColor = colorPicker.value; // Initial color
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

    const mazeImage = new Image();

    // Off-screen canvas for storing drawing content
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCtx = offScreenCanvas.getContext('2d');

    // Update status bar width based on video progress
    introVideo.addEventListener('timeupdate', function() {
        const percent = (introVideo.currentTime / introVideo.duration) * 100;
        progress.style.width = percent + '%';
        if (percent >= 100) {
            showMaze();
        }
    });

    // Event listener to hide video and show canvas when video ends
    introVideo.addEventListener('ended', function() {
        showMaze();
    });

    // Update color when color picker value changes
    colorPicker.addEventListener('input', function() {
        currentColor = colorPicker.value;
    });

    function showMaze() {
        statusBar.style.display = 'none'; // Hide status bar
        loadingStatus.style.display = 'none'; // Hide loading status
        introVideo.style.display = 'none'; // Hide video
        canvasContainer.style.display = 'block'; // Show canvas
        toolsContainer.style.display = 'block'; // Show tools
        prevButton.style.display = 'inline-block'; // Show Previous button
        nextButton.style.display = 'inline-block'; // Show Next button
        loadMaze(currentMazeIndex);
    }

    function startDrawing(e) {
        e.preventDefault(); // Prevent default touch behavior
        drawing = true;
        draw(e); // To draw a point at the starting position
    }

    function draw(e) {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width; // Scaling factor for X
        const scaleY = canvas.height / rect.height; // Scaling factor for Y

        let x, y;

        // Detect if the event is a touch or mouse event
        if (e.touches) {
            // Handle touch event
            const touch = e.touches[0];
            x = (touch.clientX - rect.left) * scaleX;
            y = (touch.clientY - rect.top) * scaleY;
        } else {
            // Handle mouse event
            x = (e.clientX - rect.left) * scaleX;
            y = (e.clientY - rect.top) * scaleY;
        }

        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor; // Use current color

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        // Draw to off-screen canvas as well
        offScreenCtx.lineWidth = size;
        offScreenCtx.lineCap = 'round';
        offScreenCtx.strokeStyle = currentColor; // Use current color
        offScreenCtx.lineTo(x, y);
        offScreenCtx.stroke();
        offScreenCtx.beginPath();
        offScreenCtx.moveTo(x, y);
    }

    function stopDrawing(e) {
        e.preventDefault(); // Prevent default touch behavior
        drawing = false;
        ctx.beginPath(); // Reset the path
        offScreenCtx.beginPath(); // Reset the path on off-screen canvas
    }

    // Set tool size
    window.setSize = function(newSize) {
        size = newSize;
    };

    // Clear the canvas
    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height); // Redraw maze
        offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height); // Clear off-screen canvas
    };

    // Align brush with mouse pointer
    canvas.addEventListener('mouseenter', () => {
        canvas.style.cursor = 'crosshair';
    });

    // Load maze image
    function loadMaze(index, animation) {
        mazeImage.src = document.fullscreenElement ? fullscreenMazeImages[index] : mazeImages[index];
        mazeImage.onload = function() {
            canvas.width = mazeImage.width;
            canvas.height = mazeImage.height;
            offScreenCanvas.width = mazeImage.width;
            offScreenCanvas.height = mazeImage.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height);

            // Clear off-screen canvas as well
            offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);

            // Apply animation if provided
            if (animation) {
                canvas.classList.add(animation);
                setTimeout(() => {
                    canvas.classList.remove(animation);
                }, 500); // Adjust duration as needed
            }
        };

        // Update navigation buttons visibility
        prevButton.style.display = index === 0 ? 'none' : 'inline-block';
        nextButton.style.display = index === mazeImages.length - 1 ? 'none' : 'inline-block';
    }

    // Previous maze
    window.prevMaze = function() {
        if (currentMazeIndex > 0) {
        currentMazeIndex--; // Decrement the maze index
        loadMaze(currentMazeIndex, 'fade-in'); // Load the previous maze with animation
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
        toolsContainer.style.display = 'none';
        congratulationsPage.style.display = 'flex';

        continueButton.onclick = function() {
            congratulationsPage.style.display = 'none';
            canvasContainer.style.display = 'block';
            toolsContainer.style.display = 'block';
            if (direction === 'next') {
                currentMazeIndex++;
                loadMaze(currentMazeIndex, 'fade-in');
            } else if (direction === 'prev') {
                currentMazeIndex--;
                loadMaze(currentMazeIndex, 'fade-in');
            }
        };
    }



// Function to detect if the user is on an iOS device
function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Function to toggle fullscreen mode
function toggleFullscreen() {
    if (isIOS()) {
        // Simulate fullscreen by resizing the canvas to fit the screen
        if (isFullscreen) {
            // Exit fullscreen simulation
            canvas.style.width = '';
            canvas.style.height = '';
            canvas.classList.remove('fullscreen-mode');
            fullscreenButton.textContent = 'Go Fullscreen';
            // Restore the maze image
            loadImage(mazeImages[currentMazeIndex]);
        } else {
            // Enter fullscreen simulation
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.classList.add('fullscreen-mode');
            fullscreenButton.textContent = 'Exit Fullscreen';
            // Show fullscreen image
            loadImage(fullscreenImages[currentMazeIndex]);
        }
    } else {
        // Standard fullscreen logic
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            // Enter fullscreen mode
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.webkitRequestFullscreen) { // Safari
                canvas.webkitRequestFullscreen();
            } else if (canvas.msRequestFullscreen) { // IE11
                canvas.msRequestFullscreen();
            } else if (canvas.mozRequestFullScreen) { // Firefox
                canvas.mozRequestFullScreen();
            }
            // Load fullscreen image
            loadImage(fullscreenImages[currentMazeIndex]);
        } else {
            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { // Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE11
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            }
            // Restore the maze image
            loadImage(mazeImages[currentMazeIndex]);
        }
    }
    // Toggle fullscreen state
    isFullscreen = !isFullscreen;
}

// Load the appropriate image
function loadImage(imageSrc) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
    };
    img.src = imageSrc;
}

// Add event listener to the fullscreen button
fullscreenButton.addEventListener('click', toggleFullscreen);

// Handle fullscreen change
function handleFullscreenChange() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        fullscreenButton.textContent = 'Exit Fullscreen'; // Update button text
    } else {
        fullscreenButton.textContent = 'Go Fullscreen'; // Update button text
    }
}

// Add fullscreen change event listeners
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE11



    // Add touch event listeners for drawing
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

    // Add mouse event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Initial load
    loadMaze(currentMazeIndex);
    introVideo.play();
    statusBar.style.display = 'block'; // Show status bar
    loadingStatus.style.display = 'block';
};
