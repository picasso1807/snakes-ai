const tileWidth = 10;
const snakeTiles = 25;
const snakeLength = snakeTiles * tileWidth;
const snakeSpeed = 100;
const gameCanvas = "gameCanvas";
const gridCanvas = "gameGrid";
const scale = 0.70;
const STATES = {
    STOPPED: -1,
    PAUSE: 0,
    RUNNING: 1
}