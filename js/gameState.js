import {Rail, RailType, Tile, TileType} from "./utils.js";
import {easyMaps, hardMaps} from "./mapLayouts.js";

export const Difficulty = {
    EASY: 0,
    HARD: 1
}

export class GameState {
    mapID; // Stores which map is being played
    
    constructor(difficulty) {
        this.board = [];        // 2D array of tiles 
        this.rails = [];        // Array of placed rails
        this.oasisCount = 0;    // Keep track of how many tiles will not have rails
        this.difficulty = difficulty;
        this.initBoard(difficulty);
    }

    // Serialize the game state to a JSON object
    serialize() {
        return {
            // Deep copy the board and rails array
            board: this.board.map(row => row.map(tile => ({ ...tile }))),
            rails: this.rails.map(rail => ({ ...rail })),
            oasisCount: this.oasisCount,
            difficulty: this.difficulty,
            mapID: this.mapID
        };
    }

    // Deserialize the JSON object to a GameState object
    static deserialize(data) {
        const gameState = new GameState(data.difficulty);
        gameState.board = data.board.map(row => row.map(tile => new Tile(tile.type, tile.rotation)));
        gameState.rails = data.rails.map(rail => new Rail(rail.Y, rail.X, rail.rotation, rail.isBending, rail.type));
        gameState.oasisCount = data.oasisCount;
        gameState.mapID = data.mapID;
        return gameState;
    }

    isWithinBounds(Y, X) {
        return Y >= 0 && Y < this.board.length && X >= 0 && X < this.board.length;
    }

    // Helper function to "place" map tiles on the board. (Extract info from mapLayouts.js)
    placeMapTiles(tiles, type) {
        for (const tileInfo of tiles) {
            const [y, x, rotation] = tileInfo;
            const tile = this.board[y][x];
            tile.rotation = rotation;
            tile.type = type;
            if (type === TileType.OASIS) 
                this.oasisCount++;
        }
    }

    // Initialize board based on difficulty
    initBoard(difficulty, reset = false) {
        const boardSize = difficulty === Difficulty.EASY ? 5 : 7;

        // generate a random number between 0 and 4, if we want to reset the map, we keep the same mapID
        this.mapID = reset ? this.mapID : Math.floor(Math.random() * 5);

        // get the map tiles based on the difficulty and mapID
        const mapTiles = difficulty === Difficulty.EASY ? easyMaps[this.mapID] : hardMaps[this.mapID];

        // Initialize every tile to EMPTY
        for (let i = 0; i < boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                this.board[i][j] = new Tile();
            }
        }

        // Add custom tiles (BRIDGE, OASIS, MOUNTAIN)
        this.placeMapTiles(mapTiles.BRIDGE_TILES, TileType.BRIDGE);
        this.placeMapTiles(mapTiles.OASIS_TILES, TileType.OASIS);
        this.placeMapTiles(mapTiles.MOUNTAIN_TILES, TileType.MOUNTAIN);
    }

    getRailType(Y, X) {
        const rail = this.rails.find(rail => rail.Y === Y && rail.X === X);
        return rail ? rail.type : null;
    }

    // Lets the player place a rail or bend an existing rail
    toggleRail(Y, X) {
        // check if the coordinates are within bounds
        if (!this.isWithinBounds(Y, X))
            return;

        // check if there is already a rail on the tile, then bend it
        const existingRail = this.rails.find(rail => rail.Y === Y && rail.X === X);

        // if there is no rail, we create a new one
        if (!existingRail) {
            switch (this.board[Y][X].type) {
                // Mountain and bridge tiles can only have rails placed on them in a specific way (rotation and bending rules)
                case TileType.BRIDGE:
                    this.rails.push(new Rail(Y, X, this.board[Y][X].rotation, false, RailType.BRIDGE_RAIL));
                    break;
                case TileType.MOUNTAIN:
                    this.rails.push(new Rail(Y, X, this.board[Y][X].rotation, true, RailType.MOUNTAIN_RAIL));
                    break;
                case TileType.OASIS:
                    break;
                default:
                    this.rails.push(new Rail(Y, X, 0, false, RailType.STRAIGHT_RAIL));
            }
        }

        // if there is a rail and the rail is not placed on a bridge or mountain, we bend it
        else if (existingRail && ![RailType.BRIDGE_RAIL, RailType.MOUNTAIN_RAIL].includes(existingRail.type)) {
            existingRail.bend();
            existingRail.type = existingRail.type === RailType.BENDING_RAIL ? RailType.STRAIGHT_RAIL : RailType.BENDING_RAIL;
        }
    }

    rotateRail(Y, X) {
        if (!this.isWithinBounds(Y, X))
            return;

        // Check if there is a rail at the given position
        const existingRail = this.rails.find(rail => rail.Y === Y && rail.X === X);

        // Rails placed on Mountain and Bridge tiles cannot be rotated
        if (existingRail && ![RailType.MOUNTAIN_RAIL, RailType.BRIDGE_RAIL].includes(existingRail.type))
            existingRail.rotate();
    }

    removeRail(Y, X) {
        if (!this.isWithinBounds(Y, X))
            return;

        // check if there is a rail on the tile
        const index = this.rails.findIndex(rail => rail.Y === Y && rail.X === X);
        if (index >= 0)
            this.rails.splice(index, 1);
    }

    // Reset the map to its initial state
    resetMap() {
        this.rails = [];
        this.board = [];
        this.oasisCount = 0;
        this.initBoard(this.difficulty, true);
    }

    // Calculate whether two rails can connect
    canConnect(rail1, rail2) {
        return rail1.calculateEndPoints().some(([Y, X]) => Y === rail2.Y && X === rail2.X) &&
               rail2.calculateEndPoints().some(([Y, X]) => Y === rail1.Y && X === rail1.X);
    }

    // DFS graph traversal for solution validation
    dfs(rail, visited) {
        // Check if already visited
        if (visited.has(rail))
            return;

        // Mark the current rail as visited
        visited.add(rail);

        // Iterate over each endpoint to explore and check if they can connect
        for (const [nextY, nextX] of rail.calculateEndPoints()) {
            const nextRail = this.rails.find(r => r.Y === nextY && r.X === nextX);
            if (nextRail && this.canConnect(rail, nextRail))
                this.dfs(nextRail, visited);
        }
        return;
    };


    checkSolution() {
        // Ensure the number of placed rails is equal to the expected count
        const expectedRailCount = this.board.length ** 2 - this.oasisCount;
        if (this.rails.length !== expectedRailCount)
            return;

        // Initialize a set to track visited rails
        const visited = new Set();

        // Start the depth-first search from the first rail
        const firstRail = this.rails[0];

        if (!firstRail)
            return false; // No rails placed at all

        this.dfs(firstRail, visited);

        // Check if all rails are connected by comparing visited size to rails length
        if (visited.size !== this.rails.length)
            return;

        // check if the last rail connects to both of the endpoints
        const lastVisitedRail = Array.from(visited).pop();
        const endPoints = lastVisitedRail.calculateEndPoints();

        const neighbor1 = this.rails.find(rail => rail.Y === endPoints[0][0] && rail.X === endPoints[0][1]);
        const neighbor2 = this.rails.find(rail => rail.Y === endPoints[1][0] && rail.X === endPoints[1][1]);

        if (!neighbor1 || !neighbor2 || 
            !this.canConnect(lastVisitedRail, neighbor1) || 
            !this.canConnect(lastVisitedRail, neighbor2)) {
            return;
        }

        // Fire event to indicate solution found
        const event = new Event('solutionFound');
        document.dispatchEvent(event);
    }
}
