const tileWidth = 10;
const snakeTiles = 25;
const snakeLength = snakeTiles * tileWidth;
const snakeSpeed = 100;
function start() {
    const canvas = document.getElementById("gameCanvas");
    const canvasGrid = document.getElementById("gameGrid");
    const container = document.getElementById('game-container');
    console.log(canvas)
    canvas.width = Math.round(container.clientWidth / tileWidth) * tileWidth;
    canvasGrid.width = canvas.width;
    canvas.height = Math.round(container.clientHeight / tileWidth) * tileWidth;
    canvasGrid.height = canvas.height;
    console.log(canvas.width);
    console.log(canvas.height);

    const ctx = canvas.getContext("2d");
    const ctxGrid = canvasGrid.getContext("2d");
    ctxGrid.beginPath();
    for (let colLine = 0; colLine <= canvasGrid.width; colLine+=tileWidth) {
        ctxGrid.moveTo(colLine, 0);
        ctxGrid.lineTo(colLine, canvasGrid.height);
    }

    for (let rowLine = 0; rowLine <= canvasGrid.height; rowLine+=tileWidth) {
        ctxGrid.moveTo(0, rowLine);
        ctxGrid.lineTo(canvasGrid.width, rowLine);
    }
    ctxGrid.strokeStyle = "#ececec";
    ctxGrid.stroke();

    drawSnake(ctx);

    ctx.stroke();    
}

function drawSnake(ctx) {
    let position = 0;
    ctx.moveTo(0, 0);
    ctx.fillStyle = "green";
    setInterval(() => {
        ctx.fillRect(position, 0, tileWidth, tileWidth);
        if(position > snakeLength) {
            ctx.clearRect(position-snakeLength-tileWidth, 0, tileWidth, tileWidth);
        }
        position += tileWidth;
        if (position > ctx.canvas.width) {
            position = 0;
        }
    }, snakeSpeed);
}



document.addEventListener("DOMContentLoaded", start);


