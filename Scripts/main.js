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
    const loadingText = document.getElementById('loadingText');

    let drawing = false;
    let mode = 'draw'; // Only 'draw' mode now
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

    // Update status bar width based on video progress
    introVideo.addEventListener('timeupdate', function() {
        const percent = (introVideo.currentTime / introVideo.duration) * 100;
        progress.style.width = percent + '%';
    });

    // Event listener to hide video and show canvas when video ends
    introVideo.addEventListener('ended', function() {
        statusBar.style.display = 'none'; // Hide status bar
        loadingText.style.display = 'none'; // Hide loading text
        introVideo.style.display = 'none'; // Hide video
        canvasContainer.style.display = 'block'; // Show canvas
        toolsContainer.style.display = 'block'; // Show tools
        prevButton.style.display = 'inline-block'; // Show Previous button
        nextButton.style.display = 'inline-block'; // Show Next button
        loadMaze(currentMazeIndex);
    });

    // Event listeners for mouse actions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    function startDrawing(e) {
        drawing = true;
        draw(e); // To draw a point at the starting position
    }

    function draw(e) {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red'; // Drawing color

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath(); // Reset the path
    }

    // Set drawing mode
    window.setMode = function(newMode) {
        mode = newMode;
    };

    // Set tool size
    window.setSize = function(newSize) {
        size = newSize;
    };

    // Clear the canvas
    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height); // Redraw maze
    };

    // Align brush with mouse pointer
    canvas.addEventListener('mouseenter', () => {
        canvas.style.cursor = 'crosshair';
    });
    canvas.addEventListener('mouseleave', () => {
        canvas.style.cursor = 'default';
        stopDrawing();
    });

    // Resize canvas function
    function resizeCanvas() {
        const aspectRatio = mazeImage.width / mazeImage.height;
        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth / aspectRatio;

        ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height); // Redraw maze to fit new size
    }

    // Load maze image with animation
    function loadMaze(index, animationClass) {
        mazeImage.src = mazeImages[index];
        mazeImage.onload = function() {
            canvas.classList.remove('fade-in', 'slide-in-right', 'slide-in-left');
            canvas.classList.add(animationClass);
            resizeCanvas();
            updateNavigationButtons();
        };
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevButton.style.display = currentMazeIndex === 0 ? 'none' : 'inline-block';
        nextButton.style.display = currentMazeIndex === mazeImages.length - 1 ? 'none' : 'inline-block';
    }

    // Previous maze with animation
    window.prevMaze = function() {
        if (currentMazeIndex > 0) {
            currentMazeIndex--;
            loadMaze(currentMazeIndex, 'slide-in-left');
        }
    };

    // Next maze with animation
    window.nextMaze = function() {
        if (currentMazeIndex < mazeImages.length - 1) {
            currentMazeIndex++;
            loadMaze(currentMazeIndex, 'slide-in-right');
        }
    };

    // Show maze and tools when video is not playing or after it ends
    window.showMaze = function() {
        introVideo.style.display = 'none'; // Hide video
        statusBar.style.display = 'none'; // Hide status bar
        loadingText.style.display = 'none'; // Hide loading text
        canvasContainer.style.display = 'block'; // Show canvas
        toolsContainer.style.display = 'block'; // Show tools
        prevButton.style.display = 'inline-block'; // Show Previous button
        nextButton.style.display = 'inline-block'; // Show Next button
    };

    // Show loading text and status bar during video playback
    introVideo.addEventListener('play', function() {
        statusBar.style.display = 'block'; // Show status bar
        loadingText.style.display = 'block'; // Show loading text
    });
};
