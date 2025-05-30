// This file only contains pre-defined map layouts for the game
// Rendering and other game logic is handled elsewhere

export const easyMaps = {
    0 : {
        BRIDGE_TILES:   [[2, 0, 0], [1, 3, 0]],
        OASIS_TILES:    [[0, 4, 0], [1, 4, 0], [3, 3, 0]],
        MOUNTAIN_TILES: [[0, 1, 90], [2, 2, 180], [4, 2, 270]]
    },

    1 : {
        BRIDGE_TILES:   [[2, 0, 0], [0, 2, 90]],
        OASIS_TILES:    [[0, 0, 0], [2, 1, 0], [3, 3, 0]],
        MOUNTAIN_TILES: [[1, 1, 180], [1, 4, 180], [2, 2, 270]]
    },

    2 : {
        BRIDGE_TILES:   [[0, 2, 90], [1, 4, 0], [2, 2, 0], [4, 1, 90]],
        OASIS_TILES:    [[3, 1, 0]],
        MOUNTAIN_TILES: [[2, 1, 180], [4, 4, 180]]
    },

    3 : {
        BRIDGE_TILES:   [[0, 3, 90], [2, 0, 0]],
        OASIS_TILES:    [[4, 2, 0]],
        MOUNTAIN_TILES: [[2, 2, 90], [2, 4, 90], [4, 3, 270]]
    },

    4 : {
        BRIDGE_TILES:   [[0, 2, 90], [2, 0, 0], [3, 2, 0]],
        OASIS_TILES:    [[3, 3, 0]],
        MOUNTAIN_TILES: [[1, 1, 0], [2, 3, 270], [4, 1, 180]]
    }
}

export const hardMaps = {
    0 : {
        BRIDGE_TILES:   [[1, 0, 0], [2, 2, 0], [0, 5, 90], [4, 4, 90], [6, 3, 90]],
        OASIS_TILES:    [[0, 2, 0], [0, 3, 0], [4, 6, 0]],
        MOUNTAIN_TILES: [[0, 1, 90], [4, 0, 270], [4, 2, 90], [3, 3, 270]]
    },

    1 : {
        BRIDGE_TILES:   [[1, 0, 0], [1, 2, 90], [2, 2, 90], [2, 6, 0]],
        OASIS_TILES:    [[0, 2, 0], [4, 1, 0], [6, 2, 0]],
        MOUNTAIN_TILES: [[3, 0, 0], [5, 1, 0], [4, 3, 90], [1, 5, 180]]
    },

    2 : {
        BRIDGE_TILES:   [[0, 2, 90], [1, 6, 0], [4, 4, 90], [5, 0, 0]],
        OASIS_TILES:    [[2, 0, 0], [4, 1, 0], [6, 2, 0]],
        MOUNTAIN_TILES: [[2, 2, 270], [4, 2, 270], [6, 3, 270], [5, 5, 90]]
    },

    3 : {
        BRIDGE_TILES:   [[1, 3, 0], [3, 1, 90], [3, 5, 90], [5, 0, 0]],
        OASIS_TILES:    [[3, 3, 0]],
        MOUNTAIN_TILES: [[2, 2, 270], [1, 5, 180], [4, 2, 180], [4, 4, 90], [5, 5, 270]]
    },

    4 : {
        BRIDGE_TILES:   [[2, 1, 90], [2, 2, 90], [5, 3, 0]],
        OASIS_TILES:    [[4, 4, 0]],
        MOUNTAIN_TILES: [[1, 5, 0], [2, 4, 90], [4, 2, 0], [5, 1, 180]]
    }
}