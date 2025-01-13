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

  // Ensure the selected indices are valid
  if (!teams[homeIndex] || !teams[awayIndex]) {
      console.error("Invalid team selection.");
      return;
  }

  homeTeam = teams[homeIndex];
  awayTeam = teams[awayIndex];

  console.log("Selected Home Team:", homeTeam);
  console.log("Selected Away Team:", awayTeam);

  // Load rosters
  loadRoster("home", homeTeam.roster);
  loadRoster("away", awayTeam.roster);

  // Initialize active players and other components
  initializeActivePlayers();
  initializePlayerStats();
  initializeGrids();
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
  rosterList.forEach(li => li.classList.remove("selected"));

  if (rosterList[index]) {
      rosterList[index].classList.add("selected");
      selectedPlayer = { team, player: activePlayers[team][index] };
  } else {
      console.error(`Player at index ${index} not found for team ${team}.`);
      selectedPlayer = null;
  }
  console.log("Selected player updated:", selectedPlayer);
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
  // Add animation class
  scoreElement.classList.add("score-animate");

  // Remove animation class after animation ends
  setTimeout(() => {
    scoreElement.classList.remove("score-animate");
  }, 500);
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
    
    // Tracks currently active players for each team
    let activePlayers = {
      home: [], // Players currently on the court for the home team
      away: [], // Players currently on the court for the away team
  };
  
  // Initialize active players with the first 5 players from the roster
  function initializeActivePlayers() {
      ["home", "away"].forEach((team) => {
          activePlayers[team] = currentRoster[team].slice(0, 5); // First 5 players
      });
      console.log("Initialized active players:", activePlayers);
  }
  

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
    
   
    
// Tab Switching Logic
function showTab(tab) {
    const homeTab = document.getElementById("home-stats-tab");
    const awayTab = document.getElementById("away-stats-tab");
    const homeButton = document.getElementById("home-tab");
    const awayButton = document.getElementById("away-tab");
  
    if (tab === "home") {
      homeTab.style.display = "block";
      awayTab.style.display = "none";
      homeButton.classList.add("active");
      awayButton.classList.remove("active");
    } else if (tab === "away") {
      homeTab.style.display = "none";
      awayTab.style.display = "block";
      homeButton.classList.remove("active");
      awayButton.classList.add("active");
    }
  }
  
  // Main View Toggle
  function toggleView(view) {
    const statsToggle = document.getElementById("stats-toggle");
    const chartsToggle = document.getElementById("charts-toggle");
    const statsView = document.getElementById("stats-view");
    const chartsView = document.getElementById("charts-view");
  
    if (view === "stats") {
      statsToggle.classList.add("active");
      chartsToggle.classList.remove("active");
      statsView.classList.add("active");
      chartsView.classList.remove("active");
    } else if (view === "charts") {
      chartsToggle.classList.add("active");
      statsToggle.classList.remove("active");
      chartsView.classList.add("active");
      statsView.classList.remove("active");
    }
  }
  
// Initialize Default View
document.addEventListener("DOMContentLoaded", () => {
  toggleView("stats"); // Default to Stats Sheet
  showTab("home"); // Default to Home Team
  initializeGrids(); // Initialize Grids
  initializeCharts(); // Initialize Charts
});

let lastRecordedStat = null; // Prevent duplicate calls
let homeGrid, awayGrid;
let shootingChart, reboundsTurnoversChart;

// Team-level stats
let teamStats = {
  home: {
      points: { twoPoint: 0, threePoint: 0, freeThrow: 0 },
      shotsMade: { twoPoint: 0, threePoint: 0, freeThrow: 0 },
      rebounds: 0,
      turnovers: 0,
      assists: 0,
      blocks: 0,
      steals: 0,
      fouls: 0,
  },
  away: {
      points: { twoPoint: 0, threePoint: 0, freeThrow: 0 },
      shotsMade: { twoPoint: 0, threePoint: 0, freeThrow: 0 },
      rebounds: 0,
      turnovers: 0,
      assists: 0,
      blocks: 0,
      steals: 0,
      fouls: 0,
  },
};


// Initialize Charts
// Initialize Charts
function initializeCharts() {
  shootingChart = new ApexCharts(document.querySelector("#shooting-accuracy-chart"), {
      chart: { type: "bar", height: 400 },
      series: [
          { name: "Home", data: [0, 0, 0] },
          { name: "Away", data: [0, 0, 0] },
      ],
      xaxis: { categories: ["2-Point", "3-Point", "Free Throw"] },
  });
  shootingChart.render();

  reboundsTurnoversChart = new ApexCharts(
      document.querySelector("#rebounds-turnovers-chart"),
      {
          chart: { type: "bar", height: 400 },
          series: [
              { name: "Home", data: [0, 0] },
              { name: "Away", data: [0, 0] },
          ],
          xaxis: { categories: ["Rebounds", "Turnovers"] },
      }
  );
  reboundsTurnoversChart.render();
}
function prepareTeamStats(team) {
  const data = [];
  currentRoster[team].forEach((player) => {
      const key = `${team} - ${player.name} #${player.number}`;
      const stats = playerStats[key] || {
          points: 0,
          freeThrows: 0,
          assists: 0,
          rebounds: 0,
          blocks: 0,
          steals: 0,
          turnovers: 0,
          fouls: 0,
      };
      data.push([
          player.name,          // Player Name
          stats.points,         // Total Points
          stats.freeThrows,     // Free Throws
          stats.assists,        // Assists
          stats.rebounds,       // Rebounds
          stats.blocks,         // Blocks
          stats.steals,         // Steals
          stats.turnovers,      // Turnovers
          stats.fouls,          // Fouls
      ]);
  });
  return data;

}
function updateGrids() {
  if (homeGrid) {
      homeGrid.updateConfig({ data: prepareTeamStats("home") }).forceRender();
  } else {
      console.error("Home Grid is not initialized.");
  }

  if (awayGrid) {
      awayGrid.updateConfig({ data: prepareTeamStats("away") }).forceRender();
  } else {
      console.error("Away Grid is not initialized.");
  }
}

function initializeGrids() {
  const homeStatsContainer = document.getElementById("home-stats");
  const awayStatsContainer = document.getElementById("away-stats");

  if (homeStatsContainer) {
      homeStatsContainer.innerHTML = ""; // Clear existing content
      homeGrid = new gridjs.Grid({
          columns: ["Player", "Points", "Free Throws", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers", "Fouls"],
          data: prepareTeamStats("home"),
          pagination: true,
          search: true,
          sort: true,
      }).render(homeStatsContainer);
  } else {
      console.error("Home stats container is not found.");
  }

  if (awayStatsContainer) {
      awayStatsContainer.innerHTML = ""; // Clear existing content
      awayGrid = new gridjs.Grid({
          columns: ["Player", "Points", "Free Throws", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers", "Fouls"],
          data: prepareTeamStats("away"),
          pagination: true,
          search: true,
          sort: true,
      }).render(awayStatsContainer);
  } else {
      console.error("Away stats container is not found.");
  }
}




// Initialize Player Stats for All Players
function initializePlayerStats() {
    ["home", "away"].forEach((team) => {
        currentRoster[team].forEach((player) => {
            const key = `${team} - ${player.name} #${player.number}`;
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
                    timestamps: [],
                };
            }
        });
    });
}

// Initialize Grids to Show All Players
function generateStats() {
  const wb = XLSX.utils.book_new();

  const data = {
      home: [["Player", "Points", "Free Throws", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers", "Fouls", "Timestamps"]],
      away: [["Player", "Points", "Free Throws", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers", "Fouls", "Timestamps"]],
  };

  for (const playerKey in playerStats) {
      const stats = playerStats[playerKey];
      const [team, playerName] = playerKey.split(" - ");
      const teamKey = team.toLowerCase();

      if (teamKey === "home" || teamKey === "away") {
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

  for (const team in data) {
      if (data[team].length > 1) {
          const ws = XLSX.utils.aoa_to_sheet(data[team]);
          XLSX.utils.book_append_sheet(wb, ws, `${team.charAt(0).toUpperCase() + team.slice(1)} Team`);
      }
  }

  XLSX.writeFile(wb, "game_stats.xlsx");
}


// Substitution Function: Replaces a player and updates the active roster
function substitutePlayer(newPlayer, team, playerOffIndex) {
  if (!newPlayer || typeof newPlayer !== "object") {
      alert("Invalid player for substitution.");
      return;
  }

  console.log(`Substituting player for ${team}. Player off: ${activePlayers[team][playerOffIndex].name}, Player in: ${newPlayer.name}`);

  // Update the `activePlayers` array
  activePlayers[team][playerOffIndex] = newPlayer;

  // Update `selectedPlayer` if the substituted player was selected
  if (selectedPlayer && selectedPlayer.player.name === activePlayers[team][playerOffIndex].name) {
      selectedPlayer = { team, player: newPlayer };
  }

  // Ensure stats for the new player are initialized
  const newPlayerKey = `${team} - ${newPlayer.name} #${newPlayer.number}`;
  if (!playerStats[newPlayerKey]) {
      playerStats[newPlayerKey] = {
          points: 0,
          freeThrows: 0,
          assists: 0,
          rebounds: 0,
          blocks: 0,
          steals: 0,
          turnovers: 0,
          fouls: 0,
          timestamps: [],
      };
  }

  console.log(`Substitution completed. Active players for ${team}:`, activePlayers[team]);
  console.log(`New selected player:`, selectedPlayer);

  // Refresh grids and UI
  updateGrids();
  updatePlayerDetailsUI();
}

function handleSubstitution(team, playerOffIndex, newPlayer) {
  if (!newPlayer || typeof newPlayer !== "object") {
      alert("Invalid player for substitution.");
      return;
  }

  const oldPlayer = activePlayers[team][playerOffIndex];
  if (!oldPlayer) {
      console.error(`No player to substitute out at index ${playerOffIndex} for team ${team}.`);
      return;
  }

  console.log(`Substituting out ${oldPlayer.name} for ${newPlayer.name} on team ${team}`);

  // Initialize stats for the new player if not already present
  const newPlayerKey = `${team} - ${newPlayer.name} #${newPlayer.number}`;
  if (!playerStats[newPlayerKey]) {
      playerStats[newPlayerKey] = {
          points: 0,
          freeThrows: 0,
          assists: 0,
          rebounds: 0,
          blocks: 0,
          steals: 0,
          turnovers: 0,
          fouls: 0,
          timestamps: [],
      };
  }

  // Update `activePlayers` for the team
  activePlayers[team][playerOffIndex] = newPlayer;

  // Update `selectedPlayer` if the substituted-out player was the currently selected player
  if (
      selectedPlayer &&
      selectedPlayer.team === team &&
      selectedPlayer.player.name === oldPlayer.name
  ) {
      selectedPlayer = { team, player: newPlayer };
  }

  console.log(`Substitution complete. Active players for ${team}:`, activePlayers[team]);
  console.log(`New selected player:`, selectedPlayer);

  // Refresh grids and UI to reflect the substitution
  updateGrids();
  updatePlayerDetailsUI();
}
// Record Stat Function
function recordStat(stat) {
    if (!stat || typeof stat !== "string") {
        console.error("Invalid or missing stat:", stat);
        return;
    }

    // Prevent duplicate calls
    if (lastRecordedStat === stat) {
        return;
    }
    lastRecordedStat = stat;

    setTimeout(() => {
        lastRecordedStat = null; // Reset after a short delay
    }, 100);

    if (!selectedPlayer || !selectedPlayer.player) {
      alert("Please select a player first.");
      return;
  }

  const key = `${selectedPlayer.team} - ${selectedPlayer.player.name} #${selectedPlayer.player.number}`;
  const currentTime = getFormattedTime();

  if (!playerStats[key]) {
      console.error("Player stats not initialized for:", key);
      return;
  }

  console.log("Recording stat for player:", selectedPlayer.player.name, "Stat:", stat);

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
            timestamps: [],
        };
    }

     // Update player and team stats
     switch (stat) {
      case "2 Points":
            playerStats[key].points += 2;
            teamStats[selectedPlayer.team].points.twoPoint += 2;
            teamStats[selectedPlayer.team].shotsMade.twoPoint += 1; // Increment shot count
            break;
        case "3 Points":
            playerStats[key].points += 3;
            teamStats[selectedPlayer.team].points.threePoint += 3;
            teamStats[selectedPlayer.team].shotsMade.threePoint += 1; // Increment shot count
            break;
        case "Free Throw":
            playerStats[key].points += 1;
            playerStats[key].freeThrows += 1;
            teamStats[selectedPlayer.team].points.freeThrow += 1;
            teamStats[selectedPlayer.team].shotsMade.freeThrow += 1; // Increment shot count
            break;
      case "Rebound":
          playerStats[key].rebounds += 1;
          teamStats[selectedPlayer.team].rebounds += 1;
          break;
      case "Turnover":
          playerStats[key].turnovers += 1;
          teamStats[selectedPlayer.team].turnovers += 1;
          break;
      case "Assist":
          playerStats[key].assists += 1;
          break;
      case "Block":
          playerStats[key].blocks += 1;
          break;
      case "Steal":
          playerStats[key].steals += 1;
          break;
      case "Foul":
          playerStats[key].fouls += 1;
          break;
      default:
          console.error("Unknown stat type:", stat);
          return; // Stop execution if the stat type is invalid
  }

    playerStats[key].timestamps.push(`${stat} at ${currentTime}`);

    // Update charts and grids
    updateShootingChart();
    updateReboundsChart();
    updateGrids();
}


function updatePlayerDetailsUI() {
  const playerDetailsElement = document.getElementById("selected-player-details");
  if (playerDetailsElement && selectedPlayer) {
      const { name, number } = selectedPlayer.player;
      playerDetailsElement.textContent = `${name} - #${number}`;
  } else {
      console.warn("Player details element not found or no player selected.");
  }
}



// Update Charts
function updateShootingChart() {
  const homeData = [
      teamStats.home.shotsMade.twoPoint, // Use shot counts
      teamStats.home.shotsMade.threePoint,
      teamStats.home.shotsMade.freeThrow,
  ];
  const awayData = [
      teamStats.away.shotsMade.twoPoint, // Use shot counts
      teamStats.away.shotsMade.threePoint,
      teamStats.away.shotsMade.freeThrow,
  ];

  shootingChart.updateSeries([
      { name: "Home", data: homeData },
      { name: "Away", data: awayData },
  ]);
}



function updateReboundsChart() {
  const homeData = [teamStats.home.rebounds, teamStats.home.turnovers];
  const awayData = [teamStats.away.rebounds, teamStats.away.turnovers];

  reboundsTurnoversChart.updateSeries([
      { name: "Home", data: homeData },
      { name: "Away", data: awayData },
  ]);
}


// Initialize Everything on Page Load
document.addEventListener("DOMContentLoaded", () => {
    initializeCharts();
    initializePlayerStats();
    initializeGrids();
});


