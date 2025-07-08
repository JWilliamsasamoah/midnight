let teams = JSON.parse(localStorage.getItem('teams')) || [];
let currentTeamIndex = null;

document.getElementById('add-team-btn').addEventListener('click', addTeam);

// Function to render teams
function renderTeams() {
  const teamsContainer = document.getElementById('teams-container');
  teamsContainer.innerHTML = '';

  teams.sort((a, b) => b.wins - a.wins);

  teams.forEach((team, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${team.name}</td>
      <td>${team.wins}</td>
      <td>${team.losses}</td>
      <td>
        <button class="primary-btn" onclick="editRoster(${index})">Manage Roster</button>
        <button onclick="updateWin(${index})">Add Win</button>
        <button onclick="updateLoss(${index})">Add Loss</button>
      </td>
    `;
    teamsContainer.appendChild(row);
  });

  saveTeams();
}

// Function to add a new team
function addTeam() {
  const teamName = prompt('Enter team name:');
  if (!teamName) return;

  teams.push({ name: teamName, wins: 0, losses: 0, roster: [] });
  renderTeams();
}

// Function to update wins
function updateWin(index) {
  teams[index].wins++;
  renderTeams();
}

// Function to update losses
function updateLoss(index) {
  teams[index].losses++;
  renderTeams();
}

// Function to edit a team's roster
function editRoster(index) {
  currentTeamIndex = index;
  const team = teams[index];
  document.getElementById('team-roster-title').textContent = `Roster: ${team.name}`;
  renderRoster();
  document.getElementById('roster-modal').style.display = 'flex';
}

// Function to render the roster
function renderRoster() {
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';
  const team = teams[currentTeamIndex];

  team.roster.forEach((player, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${player.name} - #${player.number}
      <button onclick="removePlayer(${i})">Remove</button>
    `;
    playerList.appendChild(li);
  });
}

// Function to add a player to the roster
function addPlayerToRoster() {
  const playerName = document.getElementById('player-name').value.trim();
  const playerNumber = document.getElementById('player-number').value.trim();

  if (!playerName || !playerNumber) {
    alert('Please enter both player name and jersey number.');
    return;
  }

  teams[currentTeamIndex].roster.push({ name: playerName, number: playerNumber });
  document.getElementById('player-name').value = '';
  document.getElementById('player-number').value = '';
  renderRoster();
}

// Function to remove a player from the roster
function removePlayer(playerIndex) {
  teams[currentTeamIndex].roster.splice(playerIndex, 1);
  renderRoster();
}

// Function to save the roster
function saveRoster() {
  saveTeams();
  closeRosterModal();
}

// Function to close the roster modal
function closeRosterModal() {
  document.getElementById('roster-modal').style.display = 'none';
}



// Load teams when the page loads
document.addEventListener('DOMContentLoaded', renderTeams);
// Function to render teams
function renderTeams() {
    const teamsContainer = document.getElementById('teams-container');
    teamsContainer.innerHTML = '';
  
    teams.sort((a, b) => b.wins - a.wins);
  
    teams.forEach((team, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${team.name}</td>
        <td>${team.wins}</td>
        <td>${team.losses}</td>
        <td>
          <button class="primary-btn" onclick="editRoster(${index})">Manage Roster</button>
          <button onclick="updateWin(${index})">Add Win</button>
          <button onclick="updateLoss(${index})">Add Loss</button>
          <button class="delete-btn" onclick="deleteTeam(${index})">Delete Team</button>
        </td>
      `;
      teamsContainer.appendChild(row);
    });
  
    saveTeams();
  }
  
  // Function to delete a team
  function deleteTeam(index) {
    if (confirm(`Are you sure you want to delete the team "${teams[index].name}"?`)) {
      teams.splice(index, 1);
      renderTeams();
    }
  }
  
  // Function to save teams to local storage
  function saveTeams() {
    localStorage.setItem('teams', JSON.stringify(teams));
  }
  function saveTeamsToStorage() {
    const teams = [];
    document.querySelectorAll('.team-row').forEach(row => {
      const teamName = row.querySelector('.team-name').textContent;
      const wins = row.querySelector('.team-wins').textContent;
      const losses = row.querySelector('.team-losses').textContent;
      const roster = []; // Pull from roster UI if you have it
  
      teams.push({ teamName, wins, losses, roster });
    });
  
    localStorage.setItem('teamsData', JSON.stringify(teams));}
    // Only run if no teams exist
    const coreTeams = [
      {
        name: "Moss Park",
        wins: 0,
        losses: 0,
        roster: [
          { name: "Jadane Bennett", number: 13 },
          { name: "Kaiden Edwards", number: 2 },
          { name: "Searahani Mitchell", number: 10 },
          { name: "Amru Zein", number: 5 },
          { name: "Adam", number: 8 },
          { name: "Urijah Cooper", number: 7 },
          { name: "Abdu Ahmed", number: 9 },
          { name: "Riyad", number: 12 },
          { name: "Cruz", number: 3 }
        ]
      },
      {
        name: "Mutual Street",
        wins: 0,
        losses: 0,
        roster: [
          { name: "Justice Clark", number: 8 },
          { name: "Kaine Hamilton-Wright", number: 2 },
          { name: "David Adesanya", number: 5 },
          { name: "Kevin Vo", number: 0 },
          { name: "Mylo Noel", number: 11 },
          { name: "John-Williams Asamoah", number: 7 },
          { name: "Dayton L", number: 3 }
        ]
      },
      {
        name: "Pelham Park",
        wins: 0,
        losses: 0,
        roster: [
          { name: "Triheim", number: 10 },
          { name: "Jahzari", number: 3 },
          { name: "Truzane", number: 4 },
          { name: "Pedro", number: 9 },
          { name: "Chad", number: 8 },
          { name: "Jason", number: 5 },
          { name: "Kemyron", number: 0 },
          { name: "Deshawn", number: 2 },
          { name: "Prynce", number: 1 }
        ]
      },
      {
        name: "Tobermory",
        wins: 0,
        losses: 0,
        roster: [
          { name: "Dayshaun", number: 0 },
          { name: "Devonte", number: 1 },
          { name: "Dayveon", number: 2 },
          { name: "Antoine", number: 3 },
          { name: "Ruby", number: 4 },
          { name: "Nick", number: 6 },
          { name: "Raheem", number: 7 },
          { name: "Jamal", number: 8 },
          { name: "Rohan", number: 9 },
          { name: "Taejaun", number: 10 },
          { name: "Ramzi", number: 11 },
          { name: "Ryan", number: 12 }
        ]
      },
      {
        name: "Victoria Park",
        wins: 0,
        losses: 0,
        roster: [
          { name: "Ali Ricketts", number: 0 },
          { name: "Edric Onebunne", number: 4 },
          { name: "Malik Gittens", number: 5 },
          { name: "Darius Alai", number: 6 },
          { name: "Shaheem Tantawi", number: 2 },
          { name: "Chyen Daniel", number: 7 },
          { name: "Cameron Soulliere", number: 8 },
          { name: "Darell Osmond", number: 3 },
          { name: "Phillip Byers", number: 11 },
          { name: "Makai Logan", number: 9 },
          { name: "Shy Pinnock", number: 1 },
          { name: "Josh Holder", number: 10 }
        ]
      },
      {
        name: "Brahms-Sparroways",
        wins: 0,
        losses: 0,
        roster: [
          { name: "Abdi Malik Hussein", number: 9 },
          { name: "Anastasios Balkos", number: 1 },
          { name: "Luther Hinckson", number: 3 },
          { name: "Davonta Jackson", number: 10 },
          { name: "Zachariah Eweka", number: 0 },
          { name: "Kymanie Buckle", number: 5 },
          { name: "Isaiah Wall-Grant", number: 11 },
          { name: "Rashawn Singh", number: 7 },
          { name: "Jehaziah Springer", number: 4 },
          { name: "Nam Vo-Lacey", number: 2 },
          { name: "Josh Duku", number: 6 }
        ]
      }
    ];
    
    // Save to localStorage and reload
    localStorage.setItem("teams", JSON.stringify(coreTeams));
 
    