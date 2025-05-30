import { GameState } from './gameState.js';
import { Render } from './render.js';

function delegate(parent, childSelector, when, what) {
    parent.addEventListener(when, (event) => {
        const closestChild = event.target.closest(childSelector);
        if (closestChild) {
            what(event, closestChild);
        }
    });
}

// Responsible for connecting the board rendering and game state, as well as event delegation
export class GameController {
    // Fields
    gameState;
    render;

    addEventListeners() {
        
        // Before delegating, make sure we don't have any existing event listeners
        const newContainer = this.render.container.cloneNode(true);
        this.render.container.parentNode.replaceChild(newContainer, this.render.container);
        this.render.container = newContainer;

        // Delegate event listeners for click and context menu
        delegate(this.render.container, '.tile', 'click', (event, closestTile) => this.handleClick(event, closestTile));
        delegate(this.render.container, '.tile', 'contextmenu', (event, closestTile) => this.handleRightClick(event, closestTile));
    }

    initWithGameState(gameState) {
        this.gameState = gameState;
        this.render = new Render(gameState);
        this.isRunning = true;

        this.addEventListeners();
    }

    init(difficulty) {
        this.gameState = new GameState(difficulty);
        this.render = new Render(this.gameState);
        this.isRunning = true;

        this.addEventListeners();
    }

    // Handle left-click events
    handleClick(event, closestTile) {
        // Prevent default behavior
        event.preventDefault();

        const coordinates = this.getCoordinates(closestTile);
        // If no valid coordinates found, exit
        if (!coordinates)
            return;

        const [Y, X] = coordinates;

        if (event.ctrlKey)
            this.eraseRail(Y, X);
        else {
            this.toggleRail(Y, X);
            this.gameState.checkSolution();
        }
    }

    restartGame() {
        this.gameState.resetMap();
        this.render.renderBoard();
    }

    // Handle right-click events
    handleRightClick(event, closestTile) {
        // Prevent default context menu from appearing
        event.preventDefault();

        const coordinates = this.getCoordinates(closestTile);
        if (!coordinates) 
            return;

        const [Y, X] = coordinates;
        this.rotateRail(Y, X);
        this.gameState.checkSolution();
    }

    // Helper function to get tile coordinates from the data attribute
    getCoordinates(tileElement) {
        const coordinates = tileElement.querySelector('img').dataset.coordinates;
        if (!coordinates) return null;
        // Convert string "Y,X" into [Y, X]
        return coordinates.split(',').map(Number);
    }

    // Toggle (add or bend) rail at given coordinates
    toggleRail(Y, X) {
        this.gameState.toggleRail(Y, X);
        this.render.updateTile(Y, X);
    }

    // Rotate rail at given coordinates
    rotateRail(Y, X) {
        this.gameState.rotateRail(Y, X);
        this.render.updateTile(Y, X);
    }

    // Erase (remove) rail at given coordinates
    eraseRail(Y, X) {
        this.gameState.removeRail(Y, X);
        this.render.updateTile(Y, X);
    }
}
