import { RailType, TileType } from "./utils.js";

const tileImageLocation = "/assets/images/tiles";
const railImageLocation = "/assets/images/rails";

export class Render {
  constructor(gameState) {
    this.gameState = gameState;
    this.container = document.querySelector("#gameBoard");
    this.tileImages = this.loadTileImages();
    this.railImages = this.loadRailImages();
    this.renderBoard(); // Initial rendering of the board
  }

  loadTileImages() {
    return {
      [TileType.BRIDGE]: `${tileImageLocation}/bridge.png`,
      [TileType.OASIS]: `${tileImageLocation}/oasis.png`,
      [TileType.MOUNTAIN]: `${tileImageLocation}/mountain.png`,
      [TileType.EMPTY]: `${tileImageLocation}/empty.png`,
    };
  }

  loadRailImages() {
    return {
      [RailType.STRAIGHT_RAIL]: `${railImageLocation}/straight_rail.png`,
      [RailType.BENDING_RAIL]: `${railImageLocation}/curve_rail.png`,
      [RailType.BRIDGE_RAIL]: `${railImageLocation}/bridge_rail.png`,
      [RailType.MOUNTAIN_RAIL]: `${railImageLocation}/mountain_rail.png`,
    };
  }

  // Render the entire game board
  renderBoard() {
    this.container.innerHTML = ""; // Clear previous board
    const boardSize = this.gameState.board.length;
    // Ensure the board is displayed as an NXN grid
    this.container.style.display = "grid";
    this.container.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`; // Set grid columns

    // Render each tile
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        this.renderTile(y, x); // Render each tile
      }
    }
  }

  // Render an individual tile element
  renderTile(y, x) {
    const tile = this.gameState.board[y][x];
    const tileElement = this.createTileElement(tile, y, x);

    // Append the tile element to the board
    this.container.appendChild(tileElement);
  }

  // Create a tile element with the correct image and rotation
  createTileElement(tile, y, x) {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile"); // Add a class for event delegation

    // Make sure there is no overflow from the parent container
    tileElement.style.width = "100%";
    tileElement.style.height = "100%";

    const img = document.createElement("img");
    const railType = this.gameState.getRailType(y, x);

    // Set the appropriate image source for tile or rail
    img.src =
      railType != null ? this.railImages[railType] : this.tileImages[tile.type];

    img.style.width = "100%";
    img.style.height = "100%";

    img.style.transform = `rotate(${tile.rotation}deg)`; // Rotate the image
    img.dataset.coordinates = `${y},${x}`; // Set data attribute for identification

    tileElement.appendChild(img);
    return tileElement; // Return the tile element
  }

  // Update a single tile to avoid re-rendering the entire board each time something changes
  updateTile(y, x) {
    // find image element based on coordinates stored in data attribute
    const img = this.container.querySelector(
      `img[data-coordinates="${y},${x}"]`
    );

    // get the tile and rail type based on the coordinates
    const tile = this.gameState.board[y][x];
    const rail = this.gameState.rails.find(
      (rail) => rail.Y === y && rail.X === x
    );

    // update the image source and rotation
    img.src =
      rail != null ? this.railImages[rail.type] : this.tileImages[tile.type];
    if (rail != null) img.style.transform = `rotate(${rail.rotation}deg)`;
  }
}
