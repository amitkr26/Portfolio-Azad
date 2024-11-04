// Game setup variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let level = 1;
let objectsSliced = 0;
let gameSpeed = 1;
let isPaused = false;
let specialActive = false;

// Game canvas and context
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game objects array and colors
const objects = [];
const colors = ['#67d7f0', '#a6e02c', '#fa2473', '#fe9522'];
const specialColors = ['#ffcc00', '#ff33cc'];

// GameObject constructor
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

// Start game function
function startGame() {
    score = 0;
    objectsSliced = 0;
    level = 1;
    gameSpeed = 1;
    objects.length = 0;
    specialActive = false;
    isPaused = false;
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("new-high-score").classList.add("hidden");
    resetPortfolio();
    updateScore();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnObjects();
    drawObjects();

    // Increase difficulty and unlock portfolio sections as levels advance
    if (objectsSliced >= 5) {
        level++;
        gameSpeed += 0.5;
        objectsSliced = 0;
        unlockPortfolioSection();
    }

    updateScore();
    requestAnimationFrame(gameLoop);
}

// Spawn objects
function spawnObjects() {
    if (Math.random() < 0.03) {
        const radius = Math.random() * 20 + 20;
        const x = Math.random() * canvas.width;
        const y = canvas.height + radius;
        const isSpecial = Math.random() < 0.1;
        const object = new GameObject(x, y, radius, isSpecial);
        objects.push(object);
    }
}

// Draw objects and check for missed objects
function drawObjects() {
    objects.forEach((obj, index) => {
        obj.y -= gameSpeed;
        obj.draw();
        if (obj.y + obj.radius < 0) {
            objects.splice(index, 1);
            gameOver();
        }
    });
}

// Mouse and touch event listeners for slicing objects
canvas.addEventListener('mousedown', (e) => sliceObject(e.clientX, e.clientY));
canvas.addEventListener('touchstart', (e) => sliceObject(e.touches[0].clientX, e.touches[0].clientY));

function sliceObject(x, y) {
    objects.forEach((obj, index) => {
        if (Math.hypot(obj.x - x, obj.y - y) < obj.radius) {
            score += 10;
            objectsSliced++;
            if (obj.isSpecial && !specialActive) activateSpecial();
            objects.splice(index, 1);
        }
    });
}

// Activate slow-motion effect for special object
function activateSpecial() {
    specialActive = true;
    gameSpeed *= 0.5;
    setTimeout(() => {
        gameSpeed *= 2;
        specialActive = false;
    }, 10000);
}

// Unlock portfolio sections as levels progress
function unlockPortfolioSection() {
    document.getElementById("portfolio-header").classList.remove("hidden");
    const sectionButtons = document.querySelectorAll("#portfolio-header button");
    if (level - 1 < sectionButtons.length) sectionButtons[level - 1].disabled = false;
}

// Game over function
function gameOver() {
    isPaused = true;
    document.getElementById("game-over").classList.remove("hidden");
    document.getElementById("retry-button").classList.remove("hidden");
}

// Update score and save high score
function updateScore() {
    document.getElementById("score").innerText = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById("new-high-score").classList.remove("hidden");
    }
}

// Pause and retry buttons
document.getElementById("pause-button").addEventListener('click', () => isPaused = !isPaused);
document.getElementById("retry-button").addEventListener('click', startGame);

// Reset portfolio sections visibility
function resetPortfolio() {
    document.getElementById("portfolio-header").classList.add("hidden");
    document.querySelectorAll("#portfolio-header button").forEach(button => button.disabled = true);
}

// Start the game
startGame();