// Add a new team
function addTeam() {
    const teamsContainer = document.getElementById('teams-container');
  
    const teamDiv = document.createElement('div');
    teamDiv.className = 'team';
    teamDiv.innerHTML = `
      <h2 contenteditable="true">New Team</h2>
      <div class="player-form">
        <input type="text" placeholder="Player Name" class="player-name">
        <input type="number" placeholder="Jersey Number" class="player-number">
        <button class="add-player-btn">Add Player</button>
      </div>
      <div class="roster">
        <h3>Roster</h3>
        <ul class="player-list"></ul>
      </div>
    `;
  
    // Append the new team to the container
    teamsContainer.appendChild(teamDiv);
  
    // Add event listener for adding players
    const addPlayerBtn = teamDiv.querySelector('.add-player-btn');
    addPlayerBtn.addEventListener('click', () => addPlayer(teamDiv));
  }
  
  // Add a player to the team's roster
  function addPlayer(teamDiv) {
    const playerNameInput = teamDiv.querySelector('.player-name');
    const playerNumberInput = teamDiv.querySelector('.player-number');
    const playerList = teamDiv.querySelector('.player-list');
  
    const playerName = playerNameInput.value.trim();
    const playerNumber = playerNumberInput.value.trim();
  
    if (playerName === '' || playerNumber === '') {
      alert('Please enter both player name and jersey number.');
      return;
    }
  
    // Create a list item for the player
    const listItem = document.createElement('li');
    listItem.textContent = `${playerName} - #${playerNumber}`;
    
    // Append the player to the roster
    playerList.appendChild(listItem);
  
    // Clear the input fields
    playerNameInput.value = '';
    playerNumberInput.value = '';
  }
// Load saved teams from local storage on page load
document.addEventListener('DOMContentLoaded', loadTeams);

// Add a new team
function addTeam(teamData = { name: 'New Team', players: [] }) {
  const teamsContainer = document.getElementById('teams-container');

  const teamDiv = document.createElement('div');
  teamDiv.className = 'team';
  teamDiv.innerHTML = `
    <h2 class="team-name" onclick="toggleTeamDetails(this)"contenteditable="true">${teamData.name}</h2>
    <div class="team-details">
      <div class="player-form">
        <input type="text" placeholder="Player Name" class="player-name">
        <input type="number" placeholder="Jersey Number" class="player-number">
        <button class="add-player-btn">Add Player</button>
      </div>
      <div class="roster">
        <h3>Roster</h3>
        <ul class="player-list">
          ${teamData.players.map(player => `<li>${player.name} - #${player.number}</li>`).join('')}
        </ul>
      </div>
      <button class="save-team-btn">Save Team</button>
      <button class="delete-team-btn">Delete Team</button>
    </div>
  `;

  // Append the new team to the container
  teamsContainer.appendChild(teamDiv);

  // Event listener for adding players
  const addPlayerBtn = teamDiv.querySelector('.add-player-btn');
  addPlayerBtn.addEventListener('click', () => addPlayer(teamDiv));

  // Event listener for saving the team
  const saveTeamBtn = teamDiv.querySelector('.save-team-btn');
  saveTeamBtn.addEventListener('click', saveTeams);

  // Event listener for deleting the team
  const deleteTeamBtn = teamDiv.querySelector('.delete-team-btn');
  deleteTeamBtn.addEventListener('click', () => {
    teamDiv.remove();
    saveTeams(); // Update local storage after deletion
  });
}

// Toggle team details (minimize/expand)
function toggleTeamDetails(teamNameElement) {
  const teamDetails = teamNameElement.nextElementSibling;
  teamDetails.style.display = teamDetails.style.display === 'none' ? 'block' : 'none';
}

// Add a player to the team's roster
function addPlayer(teamDiv) {
  const playerNameInput = teamDiv.querySelector('.player-name');
  const playerNumberInput = teamDiv.querySelector('.player-number');
  const playerList = teamDiv.querySelector('.player-list');

  const playerName = playerNameInput.value.trim();
  const playerNumber = playerNumberInput.value.trim();

  if (playerName === '' || playerNumber === '') {
    alert('Please enter both player name and jersey number.');
    return;
  }

  // Create a list item for the player
  const listItem = document.createElement('li');
  listItem.textContent = `${playerName} - #${playerNumber}`;
  
  // Append the player to the roster
  playerList.appendChild(listItem);

  // Clear the input fields
  playerNameInput.value = '';
  playerNumberInput.value = '';
}

// Save all teams to local storage
function saveTeams() {
  const teams = [];
  document.querySelectorAll('.team').forEach(teamDiv => {
    const teamName = teamDiv.querySelector('.team-name').textContent;
    const players = Array.from(teamDiv.querySelectorAll('.player-list li')).map(li => {
      const [name, number] = li.textContent.split(' - #');
      return { name, number };
    });
    teams.push({ name: teamName, players });
  });

  localStorage.setItem('teams', JSON.stringify(teams));
  alert('Teams saved successfully!');
}

// Load teams from local storage
function loadTeams() {
  const savedTeams = JSON.parse(localStorage.getItem('teams')) || [];
  savedTeams.forEach(teamData => addTeam(teamData));
}
