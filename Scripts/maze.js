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
    const colorInput = document.getElementById('color');

    let drawing = false;
    let brushSize = sizeInput.value;
    let brushColor = colorInput.value;
    let mode = 'draw';
    let currentIndex = 0;
    const mazes = ['Images/maze1.png', 'Images/maze2.png', 'Images/maze3.png'];
    
    // Sync the brush color to the selected color from the color picker
    colorInput.addEventListener('input', function() {
        brushColor = this.value;
    });

    function resizeCanvas() {
        const containerWidth = canvasContainer.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.75; // Maintain aspect ratio
        loadMaze(currentIndex);
    }

    function loadMaze(index) {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = mazes[index];
    }

    function setSize(newSize) {
        brushSize = newSize;
    }

    function setMode(newMode) {
        mode = newMode;
    }

    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function endDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loadMaze(currentIndex);
    }

    function prevMaze() {
        if (currentIndex > 0) {
            currentIndex--;
            loadMaze(currentIndex);
        }
    }

    function nextMaze() {
        if (currentIndex < mazes.length - 1) {
            currentIndex++;
            loadMaze(currentIndex);
        }
    }

    function enterFullscreen() {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) { // Firefox
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) { // IE/Edge
            gameContainer.msRequestFullscreen();
        }
    }

    fullscreenButton.addEventListener('click', enterFullscreen);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', (e) => startDrawing(e.touches[0]));
    canvas.addEventListener('touchend', endDrawing);
    canvas.addEventListener('touchmove', (e) => draw(e.touches[0]));
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    introVideo.addEventListener('ended', function() {
        introVideo.style.display = 'none';
        canvasContainer.style.display = 'block';
        toolsContainer.style.display = 'block';
        statusBar.style.display = 'block';
        loadingStatus.style.display = 'block';
        loadMaze(currentIndex);
    });

    continueButton.addEventListener('click', function() {
        congratulationsPage.style.display = 'none';
        nextMaze();
    });
}
