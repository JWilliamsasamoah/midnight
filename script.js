let homeScore = 0;
let awayScore = 0;
let homeTimeouts = 0;
let awayTimeouts = 0;
let homeFouls = 0;
let awayFouls = 0;
let selectedPlayer = null;
let playerStats = {};
let clockRunning = false;
let gameClock = 420; // 7 minutes
let clockInterval;
let teams = JSON.parse(localStorage.getItem("teams")) || [];
let homeTeam = null;
let awayTeam = null;
let currentRoster = { home: [], away: [] };
let period = 1;          // Current game period
const maxPeriod = 4; 

// Load teams from localStorage
console.log('Loaded Teams:', teams);

// Load teams into dropdowns
function loadTeamsIntoDropdowns() {
  const homeSelect = document.getElementById("home-team-select");
  const awaySelect = document.getElementById("away-team-select");

  homeSelect.innerHTML = '<option value="">Select Home Team</option>';
  awaySelect.innerHTML = '<option value="">Select Away Team</option>';

  teams.forEach((team, index) => {
    const option = `<option value="${index}">${team.name}</option>`;
    homeSelect.insertAdjacentHTML("beforeend", option);
    awaySelect.insertAdjacentHTML("beforeend", option);
  });
}

// Set selected teams and load their rosters
function setTeams() {
  const homeIndex = document.getElementById("home-team-select").value;
  const awayIndex = document.getElementById("away-team-select").value;

  if (!homeIndex || !awayIndex) {
    alert("Please select both Home and Away teams.");
    return;
  }

  if (homeIndex === awayIndex) {
    alert("Home and Away teams cannot be the same.");
    return;
  }

  homeTeam = teams[homeIndex];
  awayTeam = teams[awayIndex];

  console.log('Selected Home Team:', homeTeam);
  console.log('Selected Away Team:', awayTeam);

  loadRoster("home", homeTeam.roster);
  loadRoster("away", awayTeam.roster);
}

function loadRoster(team, roster) {
    const container = document.getElementById(`${team}-roster`);
  
    if (!container) {
      console.error(`Container for team "${team}" not found.`);
      return;
    }
  
    container.innerHTML = ""; // Clear previous roster
  
    currentRoster[team] = Array.isArray(roster) ? roster : [];
  
    if (currentRoster[team].length === 0) {
      container.innerHTML = `<li>No players in the roster</li>`;
      return;
    }
  
    currentRoster[team].forEach((player, index) => {
      if (player && player.name && player.number) {
        const playerHTML = `
          <li onclick="selectPlayer('${team}', ${index})">
            ${player.name} - #${player.number}
          </li>`;
        container.innerHTML += playerHTML;
      } else {
        console.warn(`Invalid player data at index ${index} for team "${team}"`);
      }
    });
  }
  
  

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadTeamsIntoDropdowns);
  

function selectPlayer(team, index) {
    const rosterList = document.querySelectorAll(`#${team}-roster li`);
  
    // Clear previous selections
    rosterList.forEach(li => li.classList.remove('selected'));
  
    // Ensure the player exists in the roster list
    if (rosterList[index]) {
      rosterList[index].classList.add('selected');
      selectedPlayer = { team, player: currentRoster[team][index] };
    } else {
      console.error(`Player at index ${index} not found for team "${team}".`);
      selectedPlayer = null;
    }
  }
  
  function setCustomTime() {
    const timeInput = document.getElementById('time-input').value;
    const [minutes, seconds] = timeInput.split(':').map(Number);
  
    if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0 && seconds < 60) {
      gameClock = minutes * 60 + seconds;  // Set the gameClock variable
      updateClockDisplay();                // Update the display
    } else {
      alert('Please enter a valid time in MM:SS format.');
    }
  }
 
// Update Score
function updateScore(points) {
  if (!selectedPlayer) {
    alert("Please select a player first.");
    return;
  }

  const { team } = selectedPlayer;

  if (team === "home") {
    homeScore += points;
    document.getElementById("home-score").textContent = homeScore;
  } else {
    awayScore += points;
    document.getElementById("away-score").textContent = awayScore;
  }

  recordStat(points === 1 ? "Free Throw" : points === 2 ? "2 Points" : "3 Points");
}

function recordStat(stat) {
    if (!selectedPlayer || !selectedPlayer.player) {
      alert('Please select a player first.');
      return;
    }
  
    const key = `${selectedPlayer.team} - ${selectedPlayer.player.name} #${selectedPlayer.player.number}`;
    const currentTime = getFormattedTime();
  
    if (!playerStats[key]) {
      playerStats[key] = {
        points: 0,
        freeThrows: 0,
        assists: 0,
        rebounds: 0,
        blocks: 0,
        steals: 0,
        turnovers: 0,
        fouls: 0,
        timestamps: []
      };
    }
  
    switch (stat) {
      case '2 Points':
        playerStats[key].points += 2;
        break;
      case '3 Points':
        playerStats[key].points += 3;
        break;
      case 'Free Throw':
        playerStats[key].points += 1;
        playerStats[key].freeThrows += 1;
        break;
      case 'Assist':
        playerStats[key].assists += 1;
        break;
      case 'Rebound':
        playerStats[key].rebounds += 1;
        break;
      case 'Block':
        playerStats[key].blocks += 1;
        break;
      case 'Steal':
        playerStats[key].steals += 1;
        break;
      case 'Turnover':
        playerStats[key].turnovers += 1;
        break;
      case 'Foul':
        playerStats[key].fouls += 1;
        break;
    }
  
    // Add timestamp
    playerStats[key].timestamps.push(`${stat} at ${currentTime}`);
  }
  
  // Update timeouts
function updateTimeout(team) {
    const timeoutElement = document.getElementById(`${team}-timeouts`);
    let timeouts = parseInt(timeoutElement.textContent, 10);
    timeouts++;
    timeoutElement.textContent = timeouts;
  }

// Update Fouls
function updateFouls(team) {
  if (team === "home") {
    homeFouls++;
    document.getElementById("home-fouls").textContent = homeFouls;
  } else {
    awayFouls++;
    document.getElementById("away-fouls").textContent = awayFouls;
  }
}

// Start or Stop the Clock
function startStopClock() {
    if (clockRunning) {
      clearInterval(clockInterval);
      clockRunning = false;
    } else {
      clockInterval = setInterval(() => {
        if (gameClock <= 0) {
          clearInterval(clockInterval);
          clockRunning = false;
          advancePeriod();
        } else {
          gameClock--;
          updateClockDisplay();
        }
      }, 1000);
      clockRunning = true;
    }
  }
  
  // Update Clock Display
  function updateClockDisplay() {
    const minutes = String(Math.floor(gameClock / 60)).padStart(2, "0");
    const seconds = String(gameClock % 60).padStart(2, "0");
    document.getElementById("game-clock").textContent = `${minutes}:${seconds}`;
  }
  
  // Advance to the Next Period
  function advancePeriod() {
    const periodElement = document.getElementById("period");
    if (!periodElement) {
      console.error("Element with id 'period' not found.");
      return;
    }
  
    if (period < maxPeriod) {
      period++;
      gameClock = 420; // Reset clock to 7 minutes
      updateClockDisplay();
      periodElement.textContent = `Period: ${period}`;
      alert(`Period ${period} has started!`);
    } else {
      periodElement.textContent = 'Game Over';
      alert('Game Over!');
    }
  }
  
  
  // Initialize Clock Display on Load
  document.addEventListener("DOMContentLoaded", () => {
    updateClockDisplay();
  });

function getFormattedTime() {
  const minutes = String(Math.floor(gameClock / 60)).padStart(2, "0");
  const seconds = String(gameClock % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function generateStats() {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
  
    // Prepare data structure for each team
    const data = {
      home: [["Player", "Points", "Free Throws", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers", "Fouls", "Timestamps"]],
      away: [["Player", "Points", "Free Throws", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers", "Fouls", "Timestamps"]],
    };
  
    // Iterate through playerStats to populate data for each team
    for (const playerKey in playerStats) {
      const stats = playerStats[playerKey];
      const [team, playerName] = playerKey.split(" - ");
      const teamKey = team.toLowerCase(); // 'home' or 'away'
  
      if (teamKey === 'home' || teamKey === 'away') {
        data[teamKey].push([
          playerName.trim(),
          stats.points || 0,
          stats.freeThrows || 0,
          stats.assists || 0,
          stats.rebounds || 0,
          stats.blocks || 0,
          stats.steals || 0,
          stats.turnovers || 0,
          stats.fouls || 0,
          stats.timestamps.join(", "),
        ]);
      }
    }
  
    // Add each team's data as a separate sheet in the workbook
    let sheetAdded = false;
    for (const team in data) {
      if (data[team].length > 1) {
        const ws = XLSX.utils.aoa_to_sheet(data[team]);
        XLSX.utils.book_append_sheet(wb, ws, `${team.charAt(0).toUpperCase() + team.slice(1)} Team`);
        sheetAdded = true;
      }
    }
  
    // Handle case when no data is present
    if (!sheetAdded) {
      alert("No valid data to generate the report.");
      return;
    }
  
    // Write and download the Excel file
    XLSX.writeFile(wb, "game_stats.xlsx");
  }
  
  
  
  
// Reset Game
function resetGame() {
  homeScore = 0;
  awayScore = 0;
  homeTimeouts = 0;
  awayTimeouts = 0;
  homeFouls = 0;
  awayFouls = 0;
  gameClock = 420;

  document.getElementById("home-score").textContent = homeScore;
  document.getElementById("away-score").textContent = awayScore;
  document.getElementById("home-timeouts").textContent = homeTimeouts;
  document.getElementById("away-timeouts").textContent = awayTimeouts;
  document.getElementById("home-fouls").textContent = homeFouls;
  document.getElementById("away-fouls").textContent = awayFouls;
  document.getElementById("game-clock").textContent = "07:00";

  playerStats = {};
}

// Initialize Teams on Page Load
document.addEventListener("DOMContentLoaded", () => {
  loadTeamsIntoDropdowns();
});
// Initialize Teams on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadTeamsIntoDropdowns();
  });
    
    let activePlayers = {
      home: [],
      away: [],
    };
    
    let selectedTeam = "";
    
   // Function to load roster and initialize active players
function loadRoster(team, roster) {
    currentRoster[team] = Array.isArray(roster) ? roster : [];
  
    // Ensure activePlayers is initialized to the first 5 players or fewer if the roster is smaller
    activePlayers[team] = currentRoster[team].slice(0, 5);
  
    displayRoster(team);
  }
  
  // Function to display active players
  function displayRoster(team) {
    const container = document.getElementById(`${team}-roster`);
    container.innerHTML = "";
  
    activePlayers[team].forEach((player, index) => {
      const playerItem = document.createElement("li");
      playerItem.textContent = `${player.name} - #${player.number}`;
      playerItem.onclick = () => selectPlayer(team, index);
      container.appendChild(playerItem);
    });
  }
    
    // Open the substitution modal
    function openSubstitutionModal(team) {
      selectedTeam = team;
    
      const onCourtSelect = document.getElementById("players-on-court");
      const offCourtSelect = document.getElementById("players-off-court");
    
      onCourtSelect.innerHTML = "";
      offCourtSelect.innerHTML = "";
    
      // Populate the "on court" players
      activePlayers[team].forEach((player, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${player.name} - #${player.number}`;
        onCourtSelect.appendChild(option);
      });
    
      // Populate the "off court" players
      currentRoster[team]
        .filter((player) => !activePlayers[team].includes(player))
        .forEach((player, index) => {
          const option = document.createElement("option");
          option.value = index;
          option.textContent = `${player.name} - #${player.number}`;
          offCourtSelect.appendChild(option);
        });
    
      document.getElementById("substitution-modal").style.display = "block";
    }
    
    // Perform the substitution
    function performSubstitution() {
      const onCourtSelect = document.getElementById("players-on-court");
      const offCourtSelect = document.getElementById("players-off-court");
    
      if (onCourtSelect.selectedIndex === -1 || offCourtSelect.selectedIndex === -1) {
        alert("Please select a player to substitute.");
        return;
      }
    
      const playerOffIndex = onCourtSelect.value;
      const playerOnIndex = offCourtSelect.value;
    
      const playerOff = activePlayers[selectedTeam][playerOffIndex];
      const playerOn = currentRoster[selectedTeam].filter(
        (player) => !activePlayers[selectedTeam].includes(player)
      )[playerOnIndex];
    
      // Perform the substitution
      activePlayers[selectedTeam][playerOffIndex] = playerOn;
    
      displayRoster(selectedTeam);
      closeSubstitutionModal();
    }
    
    // Close the modal
    function closeSubstitutionModal() {
      document.getElementById("substitution-modal").style.display = "none";
    }
    
   
    