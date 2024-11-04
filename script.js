const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverElement = document.getElementById("game-over");
const levelUpElement = document.getElementById("level-up");
const portfolio = document.getElementById("portfolio");
const sectionsNav = document.getElementById("sections-nav");
const retryButton = document.getElementById("retry-button");
const pauseButton = document.getElementById("pause-button");
const skipLevelButton = document.getElementById("skip-level-button");
const aboutButton = document.getElementById("about-btn");
const skillsButton = document.getElementById("skills-btn");
const educationButton = document.getElementById("education-btn");
const experienceButton = document.getElementById("experience-btn");
const contactButton = document.getElementById("contact-btn");
const gameContainer = document.getElementById("game-container");

let score = 0;
let highScore = 0;
let level = 1;
let objects = [];
let objectSpeed = 2;
let gameInterval;
let objectSpawnInterval;
let specialObjectSpawnInterval;
let isPaused = false;

// Object class
class GameObject {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.isSpecial = false;
    }

    update() {
        this.y += objectSpeed;
        this.draw();
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    hit() {
        // Create particles
        for (let i = 0; i < 10; i++) {
            createSlicingEffect(this);
        }
        score += 10;
        scoreElement.innerText = score;
        objects.splice(objects.indexOf(this), 1); // Remove object from array
        if (this.isSpecial) {
            slowDownGame(10); // Slow down the game for 10 seconds
        }
        if (score % 50 === 0) {
            levelUp();
        }
    }
}

// Function to create slicing effect
function createSlicingEffect(object) {
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocityX = Math.cos(angle) * 2;
        const velocityY = Math.sin(angle) * 2;
        drawParticle(object.x, object.y, velocityX, velocityY);
    }
}

// Function to draw particles
function drawParticle(x, y, vx, vy) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Start the game
function startGame() {
    gameContainer.classList.remove("hidden");
    portfolio.classList.add("hidden");
    score = 0;
    level = 1;
    objects = [];
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
    objectSpawnInterval = setInterval(spawnObjects, 1000);
    specialObjectSpawnInterval = setInterval(spawnSpecialObjects, 5000);
}

// Update game frame
function updateGame() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objects.forEach(object => {
            object.update();
            if (object.y > canvas.height) {
                gameOver();
            }
        });
    }
}

// Spawn normal objects
function spawnObjects() {
    const x = Math.random() * canvas.width;
    const radius = 30;
    const color = getRandomColor();
    const newObject = new GameObject(x, -radius, radius, color);
    objects.push(newObject);
}

// Spawn special objects
function spawnSpecialObjects() {
    const x = Math.random() * canvas.width;
    const radius = 30;
    const specialColor = "rgba(255, 215, 0, 0.8)";
    const newObject = new GameObject(x, -radius, radius, specialColor);
    newObject.isSpecial = true;
    objects.push(newObject);
}

// Get random color
function getRandomColor() {
    const colors = ["#67d7f0", "#a6e02c", "#fa2473", "#fe9522"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Slow down the game
function slowDownGame(seconds) {
    objectSpeed = 1;
    setTimeout(() => {
        objectSpeed = 2;
    }, seconds * 1000);
}

// Level up
function levelUp() {
    level++;
    if (level > 6) {
        level = 6; // Max level
    }
    if (level === 2) sectionsNav.classList.remove("hidden");
    if (level <= 6) {
        levelUpElement.classList.remove("hidden");
        setTimeout(() => {
            levelUpElement.classList.add("hidden");
        }, 2000);
    }
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    clearInterval(objectSpawnInterval);
    clearInterval(specialObjectSpawnInterval);
    gameOverElement.classList.remove("hidden");
    if (score > highScore) {
        high
highScore = score;
        highScoreElement.innerText = highScore;
    }
}

// Mouse and touch interaction for slicing
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

// Function to slice the object
function sliceObject(x, y) {
    objects.forEach(object => {
        const distance = Math.hypot(object.x - x, object.y - y);
        if (distance < object.radius + 10) { // Checking if hit
            object.hit();
        }
    });
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

// Restart the game
document.getElementById("restart-button").addEventListener('click', () => {
    resetGame();
});

// Reset game state
function resetGame() {
    gameOverElement.classList.add("hidden");
    score = 0;
    level = 1;
    objects = [];
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    startGame();
}

// Show portfolio sections based on level
aboutButton.addEventListener('click', () => {
    showSection('about');
});
skillsButton.addEventListener('click', () => {
    showSection('skills');
});
educationButton.addEventListener('click', () => {
    showSection('education');
});
experienceButton.addEventListener('click', () => {
    showSection('experience');
});
contactButton.addEventListener('click', () => {
    showSection('contact');
});

// Show specific section
function showSection(section) {
    document.querySelectorAll('.section').forEach((sec) => {
        sec.classList.add('hidden');
    });
    document.getElementById(section).classList.remove('hidden');
}

// Start the game on load
window.onload = startGame;