let clockInterval = null;
let secondsElapsed = 0; // Timer starts at 0
let period = 1;
const maxPeriod = 4; // Total number of periods in the game

// Update the displayed clock
function updateClock() {
  const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
  const seconds = String(secondsElapsed % 60).padStart(2, '0');
  document.getElementById('clock').textContent = `${minutes}:${seconds}`;

  if (secondsElapsed <= 0 && clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
    advancePeriod();
  }
}

// Start or stop the clock
function toggleClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  } else {
    clockInterval = setInterval(() => {
      if (secondsElapsed > 0) {
        secondsElapsed--;
        updateClock();
      } else {
        clearInterval(clockInterval);
        clockInterval = null;
        advancePeriod();
      }
    }, 1000);
  }
}

// Set custom time from user input
function setCustomTime() {
  const timeInput = document.getElementById('time-input').value;
  const [minutes, seconds] = timeInput.split(':').map(Number);
  if (!isNaN(minutes) && !isNaN(seconds)) {
    secondsElapsed = minutes * 60 + seconds;
    updateClock();
  } else {
    alert('Please enter a valid time in MM:SS format.');
  }
}

// Advance to the next period
function advancePeriod() {
  if (period < maxPeriod) {
    period++;
    document.getElementById('period').textContent = `PERIOD ${period}`;
    secondsElapsed = 0; // Reset clock to 5 minutes (300 seconds) for the new period
    updateClock();
    alert(`Period ${period} has started!`);
  } else {
    document.getElementById('period').textContent = 'GAME OVER';
    alert('Game Over!');
  }
}

// Update team score
function updateScore(team, change) {
  const scoreElement = document.getElementById(`${team}-score`);
  let currentScore = parseInt(scoreElement.textContent, 10);
  currentScore = Math.max(0, currentScore + change);
  scoreElement.textContent = currentScore;
}

// Update timeouts
function updateTimeout(team) {
  const timeoutElement = document.getElementById(`${team}-timeouts`);
  let timeouts = parseInt(timeoutElement.textContent, 10);
  timeouts++;
  timeoutElement.textContent = timeouts;
}

// Official timeout function
function officialTimeout() {
  alert('Official Timeout Called!');
}

// Initialize clock display and period display
function initializeGame() {
  period = 1; // Ensure period starts at 1
  document.getElementById('period').textContent = `PERIOD ${period}`;
  updateClock();
}

initializeGame();

// Store history of actions for undo functionality
let history = {
    home: [],
    away: []
  };
  
  // Function to update the score with undo tracking
  function updateScore(team, change) {
    const scoreElement = document.getElementById(`${team}-score`);
    let currentScore = parseInt(scoreElement.textContent, 10);
    history[team].push({ type: 'score', previousValue: currentScore });
    currentScore = Math.max(0, currentScore + change);
    scoreElement.textContent = currentScore;
  }
  
  // Function to update fouls with undo tracking
  function updateFouls(team) {
    const foulsElement = document.getElementById(`${team}-fouls`);
    let currentFouls = parseInt(foulsElement.textContent, 10);
    history[team].push({ type: 'foul', previousValue: currentFouls });
    currentFouls++;
    foulsElement.textContent = currentFouls;
  }
  
  // Function to update timeouts with undo tracking
  function updateTimeout(team) {
    const timeoutsElement = document.getElementById(`${team}-timeouts`);
    let currentTimeouts = parseInt(timeoutsElement.textContent, 10);
    history[team].push({ type: 'timeout', previousValue: currentTimeouts });
    currentTimeouts++;
    timeoutsElement.textContent = currentTimeouts;
  }
  
  // Function to undo the last action
  function undoAction(team) {
    const lastAction = history[team].pop();
    if (!lastAction) {
      alert('No actions to undo.');
      return;
    }
  
    if (lastAction.type === 'score') {
      document.getElementById(`${team}-score`).textContent = lastAction.previousValue;
    } else if (lastAction.type === 'foul') {
      document.getElementById(`${team}-fouls`).textContent = lastAction.previousValue;
    } else if (lastAction.type === 'timeout') {
      document.getElementById(`${team}-timeouts`).textContent = lastAction.previousValue;
    }
  }
  
  // Function to clear the scoreboard
  function clearScoreboard() {
    // Reset scores, timeouts, and fouls for both teams
    document.getElementById('home-score').textContent = '0';
    document.getElementById('away-score').textContent = '0';
    document.getElementById('home-timeouts').textContent = '0';
    document.getElementById('away-timeouts').textContent = '0';
    document.getElementById('home-fouls').textContent = '0';
    document.getElementById('away-fouls').textContent = '0';
  
    // Clear the history
    history = {
      home: [],
      away: []
    };
  
    alert('Scoreboard cleared!');
  }
  

// Function to toggle Court Vision overlay
function toggleCourtVision() {
  const overlay = document.getElementById('court-overlay');
  overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

// Initialize court canvas
const courtCanvas = document.getElementById('court-canvas');
const ctx = courtCanvas.getContext('2d');
let isDrawing = false;
let drawMode = true; // true for draw, false for erase

// Resize the canvas to match its display size
function resizeCanvas() {
  courtCanvas.width = courtCanvas.clientWidth;
  courtCanvas.height = courtCanvas.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Toggle draw mode
function toggleDrawMode() {
  drawMode = true;
  courtCanvas.style.cursor = 'crosshair';
}

// Toggle erase mode
function toggleEraseMode() {
  drawMode = false;
  courtCanvas.style.cursor = 'pointer';
}

// Clear the entire canvas
function clearCanvas() {
  ctx.clearRect(0, 0, courtCanvas.width, courtCanvas.height);
}

// Handle drawing and erasing
courtCanvas.addEventListener('pointerdown', (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

courtCanvas.addEventListener('pointermove', (e) => {
  if (!isDrawing) return;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineWidth = drawMode ? 3 : 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = drawMode ? '#d62828' : '#ffffff';
  ctx.stroke();
});

courtCanvas.addEventListener('pointerup', () => {
  isDrawing = false;
  ctx.closePath();
});
// Function to update the score with animation
function updateScore(team, change) {
    const scoreElement = document.getElementById(`${team}-score`);
    let currentScore = parseInt(scoreElement.textContent, 10);
    currentScore = Math.max(0, currentScore + change);
    scoreElement.textContent = currentScore;
  
    // Trigger pulse animation
    scoreElement.classList.add('pulse');
    setTimeout(() => scoreElement.classList.remove('pulse'), 500);
  }
  
  // Function to update fouls with animation
  function updateFoul(team) {
    const foulElement = document.getElementById(`${team}-fouls`);
    let currentFouls = parseInt(foulElement.textContent, 10);
    currentFouls++;
    foulElement.textContent = currentFouls;
  
    // Trigger shake animation
    foulElement.classList.add('shake');
    setTimeout(() => foulElement.classList.remove('shake'), 500);
  }
  
  // Function to update the timer with animation
  function setCustomTime() {
    const timeInput = document.getElementById('time-input').value;
    const [minutes, seconds] = timeInput.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      secondsElapsed = minutes * 60 + seconds;
      updateClock();
  
      // Trigger flash animation
      const clockElement = document.getElementById('clock');
      clockElement.classList.add('flash');
      setTimeout(() => clockElement.classList.remove('flash'), 500);
    } else {
      alert('Please enter a valid time in MM:SS format.');
    }
  }
  // Function to update fouls for a team
function updateFouls(team) {
    const foulsElement = document.getElementById(`${team}-fouls`);
    let currentFouls = parseInt(foulsElement.textContent, 10);
    currentFouls++;
    foulsElement.textContent = currentFouls;
  }
  