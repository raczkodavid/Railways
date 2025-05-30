# 🚂 Railways - Path Building Game 🛤️

A train track building puzzle game where players construct a connected railway network while navigating through obstacles.

## 📝 Description

Railways is a browser-based puzzle game where players must create a connected railway network on a grid-based map. The goal is to place tracks on every possible tile to form a complete circuit.

## ✨ Features

- Two difficulty levels: Easy (5x5 grid) and Hard (7x7 grid)
- Four different tile types: Empty, Bridge, Mountain, and Oasis
- Interactive track building with mouse controls
- Save and load game functionality
- Leaderboard system to track best times
- Pause/resume gameplay

## 🎮 How to Play

The game is played on a grid with various terrain types:

- **🟩 Empty Tiles**: Regular tiles where tracks can be placed in any direction
- **🌉 Bridge Tiles**: Tracks can only be placed in the direction of the bridge
- **⛰️ Mountain Tiles**: Tracks must turn 90° due to mountain obstacles
- **🏝️ Oasis Tiles**: No tracks can be placed on these tiles

### 🖱️ Controls

- **Left Click**: Place a track or bend an existing track
- **Right Click**: Rotate a track
- **Ctrl + Left Click**: Remove a track

## 🚀 Installation

1. Clone the repository
2. Open `index.html` in your browser
3. No build process required - it's pure HTML, CSS, and JavaScript!

## 📁 Project Structure

```
index.html             - Main game page
style.css              - Game styling
assets/                - Game assets folder
  images/              - Game images
    background/        - Background images
    rails/             - Rail images
    screenElements/    - UI elements
    tiles/             - Tile type images
js/                    - JavaScript files
  gameController.js    - Game interaction handling
  gameState.js         - Game logic and state management
  index.js             - Main game initialization
  mapLayouts.js        - Predefined game maps
  render.js            - Game board rendering
  utils.js             - Utility classes and constants
```

## 💻 Development

This game is built with vanilla JavaScript using ES6 modules, HTML5, and CSS3. The project uses no external dependencies beyond Bootstrap for styling.

## 🧠 Technical Details

The Railways game uses vanilla JavaScript with ES6 modules for clean code organization. The architecture separates game logic, rendering, and user interactions into distinct components.

## 👨‍💻 Credit

- Developed by: Raczkó Dávid
- Email: raczkodavid@gmail.com
