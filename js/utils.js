export const TileType = {
    EMPTY: 0,
    BRIDGE: 1,
    MOUNTAIN: 2,
    OASIS: 3
}

export const RailType = {
    STRAIGHT_RAIL: 0,
    BENDING_RAIL: 1,
    BRIDGE_RAIL: 2,
    MOUNTAIN_RAIL: 3
}

export class Rail {
    constructor(Y, X, rotation = 0, isBending = false, type = RailType.STRAIGHT_RAIL) {
        this.Y = Y;                     // Vertical coordinate
        this.X = X;                     // Horizontal coordinate
        this.rotation = rotation;       // Rotation in degrees (0, 90, 180, 270)
        this.isBending = isBending;
        this.type = type;               // (straight, bending, bridge, mountain)
    }

    // Rotate rail by 90 degrees
    rotate() {
        this.rotation = (this.rotation + 90) % 360;
    }

    // Bend rail
    bend() {
        this.isBending = !this.isBending;
    }

    // Calculate which tiles the rail connects
    calculateEndPoints() {
        if (this.isBending) {
            switch (this.rotation) {
                case 0:
                    return [[this.Y + 1, this.X], [this.Y, this.X + 1]];
                case 90:
                    return [[this.Y, this.X - 1], [this.Y + 1, this.X]];
                case 180:
                    return [[this.Y - 1, this.X], [this.Y, this.X - 1]];
                case 270:
                    return [[this.Y - 1, this.X], [this.Y, this.X + 1]];
                default:
                    throw new Error('Invalid rotation value for bending rail');
            }
        } else {
            if (this.rotation === 0 || this.rotation === 180)
                return [[this.Y + 1, this.X], [this.Y - 1, this.X]]; // Vertical straight rail
            else
                return [[this.Y, this.X - 1], [this.Y, this.X + 1]]; // Horizontal straight rail
        }
    }
}

export class Tile {
    constructor(type = TileType.EMPTY, rotation = 0) {
        this.type = type;              // (empty, bridge, mountain, oasis)
        this.rotation = rotation;       // Rotation in degrees (0, 90, 180, 270)
    }
}