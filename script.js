// Game setup variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let level = 0;
let objectsSliced = 0;
let gameSpeed = 1;
let gameInterval;
let isPaused = false;

// Game canvas and context
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize game objects
const objects = [];
const colors = ['#67d7f0', '#a6e02c', '#fa2473', '#fe9522'];
const specialColors = ['#ffcc00', '#ff33cc'];

// Object constructor
class GameObject {
    constructor(x, y, radius, isSpecial) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isSpecial = isSpecial;
        this.color = isSpecial ? specialColors[Math.floor(Math.random() * specialColors.length)] : colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Start game
function startGame() {
    score = 0;
    objectsSliced = 0;
    level = 0;
    objects.length = 0;
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("retry-button").classList.add("hidden");
    document.getElementById("portfolio-header").classList.add("hidden");
    resetCanvas();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnObjects();
    drawObjects();

    // Check for game over
    if (objects.length === 0 && objectsSliced >= 5) {
        level++;
        objectsSliced = 0;
        if (level < 6) {
            unlockSection();
        } else {
            gameWin(); // Trigger game win if all levels are completed
        }
    }

    // Update score and difficulty
    updateScore();
    gameSpeed += 0.01; // Increase speed with time

    requestAnimationFrame(gameLoop);
}

// Spawn objects
function spawnObjects() {
    if (Math.random() < 0.03) {
        const radius = Math.random() * 20 + 20;
        const x = Math.random() * canvas.width;
        const y = canvas.height + radius;
        const isSpecial = Math.random() < 0.1; // 10% chance of being a special object
        const object = new GameObject(x, y, radius, isSpecial);
        objects.push(object);
    }
}

// Draw objects
function drawObjects() {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        obj.y -= gameSpeed; // Move object upwards
        obj.draw();

        // Remove objects that have gone off-screen
        if (obj.y + obj.radius < 0) {
            objects.splice(i, 1);
            i--; // Adjust index after removal
            gameOver(); // Game over if an object is missed
        }
    }
}

// Unlock portfolio section
function unlockSection() {
    document.getElementById("portfolio-header").classList.remove("hidden");
    document.getElementById("portfolio-header").querySelectorAll("button")[level - 1].disabled = false;
}

// Game win function
function gameWin() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Congratulations! You've completed all levels!", canvas.width / 2, canvas.height / 2);
}

// Update score
function updateScore() {
    document.getElementById("score").innerText = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById("high-score").innerText = highScore;
    }
}

// Handle slicing of objects
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    sliceObject(mouseX, mouseY);
});

canvas.addEventListener('touchstart', (event) => {
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;
    sliceObject(touchX, touchY);
});

// Slicing function
function sliceObject(x, y) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const distance = Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2);
        if (distance < obj.radius) {
            score += 10;
            objectsSliced++;
            objects.splice(i, 1);
            if (obj.isSpecial) {
                // Slow down game for 10 seconds if special object is sliced
                slowDownGame();
            }
            return;
        }
    }
}

// Slow down game for special object
function slowDownGame() {
    const originalSpeed = gameSpeed;
    gameSpeed *= 0.5; // Slow down
    setTimeout(() => {
        gameSpeed = originalSpeed; // Restore original speed after 10 seconds
    }, 10000);
}

// Handle game over
function gameOver() {
    isPaused = true;
    document.getElementById("game-over").classList.remove("hidden");
    document.getElementById("retry-button").classList.remove("hidden");
}

// Retry button
document.getElementById("retry-button").addEventListener('click', startGame);

// Pause button
document.getElementById("pause-button").addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById("pause-button").innerText = isPaused ? "Resume" : "Pause";
});

// Initialize game
startGame();