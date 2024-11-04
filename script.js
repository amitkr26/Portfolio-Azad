// Game variables
let canvas, ctx;
let objects = [];
let score = 0;
let highScore = 0;
let level = 1;
let isGameOver = false;
let isPaused = false;
let gameSpeed = 1;

// UI Elements
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverElement = document.getElementById("game-over");
const pauseButton = document.getElementById("pause-button");
const retryButton = document.getElementById("retry-button");
const skipLevelButton = document.getElementById("skip-level-button");
const aboutButton = document.getElementById("about-button");
const skillsButton = document.getElementById("skills-button");
const educationButton = document.getElementById("education-button");
const experienceButton = document.getElementById("experience-button");
const contactButton = document.getElementById("contact-button");

// Colors
const colors = ["#67d7f0", "#a6e02c", "#fa2473", "#fe9522", "#ffcc00"];

// Object class
class GameObject {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50; // Start below canvas
        this.radius = 30 + Math.random() * 20;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = Math.random() * 2 + 2; // Random speed
        this.isSpecial = Math.random() < 0.2; // 20% chance to be special
    }

    update() {
        this.y -= this.speed * gameSpeed; // Move up
        if (this.y < -this.radius) {
            isGameOver = true; // Game over if object goes off-screen
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    hit() {
        score += this.isSpecial ? 15 : 10; // Increase score differently for special objects
        if (score % 50 === 0) {
            levelUp();
        }
    }
}

// Initialize game
function startGame() {
    canvas = document.getElementById("c");
    ctx = canvas.getContext("2d");
    score = 0;
    level = 1;
    objects = [];
    isGameOver = false;
    isPaused = false;
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    gameOverElement.classList.add("hidden");
    requestAnimationFrame(gameLoop);
    spawnObject();
}

// Game loop
function gameLoop() {
    if (isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw objects
    objects.forEach((object, index) => {
        object.update();
        object.draw();
        if (object.y < -object.radius) {
            objects.splice(index, 1); // Remove if off-screen
        }
    });

    // Check game over
    if (isGameOver) {
        showGameOver();
        return;
    }

    // Draw score and high score
    scoreElement.innerText = score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = highScore;
    }

    requestAnimationFrame(gameLoop);
}

// Spawn objects
function spawnObject() {
    if (isGameOver) return;
    const object = new GameObject();
    objects.push(object);
    setTimeout(spawnObject, 1000 / (level + 1)); // Faster with each level
}

// Level up
function levelUp() {
    level++;
    gameSpeed += 0.1; // Increase game speed
    if (level > 6) level = 6; // Limit to 6 levels
}

// Handle mouse and touch events for slicing
canvas.addEventListener('mousedown', (event) => {
    if (!isPaused) {
        sliceObject(event.clientX, event.clientY);
    }
});

canvas.addEventListener('touchstart', (event) => {
    if (!isPaused) {
        const touch = event.touches[0];
        sliceObject(touch.clientX, touch.clientY);
    }
});

// Slice object function
function sliceObject(x, y) {
    objects.forEach((object, index) => {
        const distance = Math.hypot(object.x - x, object.y - y);
        if (distance < object.radius + 10) { // Hit detected
            object.hit();
            objects.splice(index, 1); // Remove sliced object
        }
    });
}

// Show game over screen
function showGameOver() {
    gameOverElement.classList.remove("hidden");
    gameOverElement.innerText = "Game Over! Your score: " + score;
}

// Pause the game
pauseButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseButton.innerText = 'Pause';
    } else {
        isPaused = true;
        pauseButton.innerText = 'Resume';
    }
});

// Retry the game
retryButton.addEventListener('click', () => {
    resetGame();
});

// Skip level
skipLevelButton.addEventListener('click', () => {
    levelUp();
});

// Reset game state
function resetGame() {
    score = 0;
    level = 1;
    objects = [];
    isGameOver = false;
    isPaused = false;
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    gameOverElement.classList.add("hidden");
    startGame();
}

// Show specific section based on button clicked
aboutButton.addEventListener('click', () => showSection('about'));
skillsButton.addEventListener('click', () => showSection('skills'));
educationButton.addEventListener('click', () => showSection('education'));
experienceButton.addEventListener('click', () => showSection('experience'));
contactButton.addEventListener('click', () => showSection('contact'));

// Function to show a specific section
function showSection(section) {
    document.querySelectorAll('.section').forEach((sec) => {
        sec.classList.add('hidden');
    });
    document.getElementById(section).classList.remove('hidden');
}

// Start the game on load
window.onload = startGame;