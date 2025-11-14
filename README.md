# Midnight Basketball – Game & Stats Tracker

Midnight is a web app built for **basketball game operations** – originally designed around the **MLSE LaunchPad Midnight Basketball program**.

It combines a **live scoreboard**, **game clock**, **team & player management**, and **stats tracking** into one browser-based tool that can be run on a laptop at the scorer’s table.

---

## 🏀 What It Does

### Core Features

- **Live Scoreboard**
  - Home / Away score controls
  - Period/quarter tracking
  - Game clock display (start/stop/reset from the UI)

- **Game Management**
  - Track **team fouls** and **timeouts**
  - Reset between halves/games
  - Simple controls designed for use during live play

- **Player & Team Management**
  - Dynamic team rosters
  - Add players to teams
  - Sub in / sub out players during a game
  - Support for multiple teams across the program

- **Stats Tracking**
  - Per-player and per-team stats:
    - Points
    - Rebounds
    - Assists
    - Steals
    - Blocks
    - Fouls
    - Shooting attempts & makes (for percentages)
  - Interactive tables and summaries

- **Data Export**
  - Export game stats to **Excel/CSV** for post-game analysis, reporting, and sharing with staff/players.

- **Program Tools (Multi-Team)**
  - Teams page for managing program-wide teams
  - Matchups / schedule support (via additional HTML pages)
  - Foundations for standings and brackets

---

## 🧱 Tech Stack

- **Frontend:**  
  - HTML  
  - CSS (`style.css`, `teams_style.css`, `body {.css`)  
  - JavaScript (`script.js`, `teams_script.js`)

- **Runtime / Hosting:**
  - Static site (no backend required)
  - Works in any modern browser
  - Can be hosted on **GitHub Pages** (e.g. `https://<username>.github.io/midnight/`)

---

## 📂 Project Structure

Key files in this repo:

- `index.html` – Main scoreboard & in-game controls  
- `script.js` – Logic for scoreboard, game flow, and in-game stats  
- `teams.html` – Team management UI (rosters, program-wide teams)  
- `teams_script.js` – Logic for creating/editing teams & rosters  
- `matchmaking.html` – Page for matchups/scheduling (e.g. brackets or weekly fixtures)  
- `style.css`, `teams_style.css`, `body {.css` – Layout and styling  
- `court.png`, `logo.png`, `logop.png`, `LP.PNG` – Visual assets and branding  
- `CNAME` – Optional custom domain configuration for GitHub Pages

---

## 🚀 Running the App Locally

1. **Clone the repo:**

   ```bash
   git clone https://github.com/JWilliamsasamoah/midnight.git
   cd midnight
