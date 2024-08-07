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

    let drawing = false;
    let size = sizeInput.value;
    let currentMazeIndex = 0;

    // Maze images array
    const mazeImages = [
        'Images/maze1.png',
        'Images/maze2.png',
        'Images/maze3.png',
        'Images/maze4.png',
        'Images/maze5.png'
    ];

    const mazeImage = new Image();

    // Off-screen canvas for storing drawing content
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCtx = offScreenCanvas.getContext('2d');

    // Detect if the user is on a mobile device
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    // Update status bar width based on video progress
    introVideo.addEventListener('timeupdate', function() {
        const percent = (introVideo.currentTime / introVideo.duration) * 100;
        progress.style.width = percent + '%';
        if (percent >= 100) {
            if (isMobileDevice()) {
                showMaze();
            } else {
                // For non-mobile devices, show the maze after the video ends
                showMaze();
            }
        }
    });

    // Event listener to hide video and show canvas when video ends
    introVideo.addEventListener('ended', function() {
        if (isMobileDevice()) {
            showMaze();
        }
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
        ctx.strokeStyle = '#ff4081'; // Drawing color

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        // Draw to off-screen canvas as well
        offScreenCtx.lineWidth = size;
        offScreenCtx.lineCap = 'round';
        offScreenCtx.strokeStyle = '#ff4081';
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
        mazeImage.src = mazeImages[index];
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

    // Fullscreen functionality
    fullscreenButton.addEventListener('click', toggleFullscreen);

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Handle fullscreen change
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            fullscreenButton.textContent = 'Exit Fullscreen'; // Update button text
        } else {
            canvas.style.width = '';
            canvas.style.height = '';
            fullscreenButton.textContent = 'Go Fullscreen'; // Update button text
        }
    });

    // Add touch event listeners for drawing
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

    // Show the initial intro video
    introVideo.play();
    statusBar.style.display = 'block';
    loadingStatus.style.display = 'block';
    canvasContainer.style.display = 'none';
    toolsContainer.style.display = 'none';
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';

    // Load the first maze after the intro video
    loadMaze(currentMazeIndex);
};
