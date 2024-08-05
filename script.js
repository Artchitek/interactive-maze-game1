window.onload = function() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const sizeInput = document.getElementById('size');

    let drawing = false;
    let mode = 'draw'; // 'draw' or 'erase'
    let size = sizeInput.value;

    // Load the maze image
    const mazeImage = new Image();
    mazeImage.src = 'images/maze.png'; // Path to your image file
    mazeImage.onload = function() {
        ctx.drawImage(mazeImage, 0, 0, canvas.width, canvas.height);
    };

    // Event listeners for mouse actions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        drawing = true;
        draw(e); // To draw a point at the starting position
    }

    function draw(e) {
        if (!drawing) return;

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        ctx.lineWidth = size;
        ctx.lineCap = 'round';

        if (mode === 'draw') {
            ctx.strokeStyle = 'red'; // Drawing color
        } else if (mode === 'erase') {
            ctx.strokeStyle = 'white'; // Erasing color (background color)
        }

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
};