function init() {
    console.log("loaded");
    
    canvasHelper.init(gameCanvas, { _tileWidth: tileWidth, _scale: scale });
    canvasHelper.drawGrids(tileWidth);
    snake.OnError((msg)=> {
        alert("Game over!!!");
        window.location.reload();
    });

    const btnStart = document.getElementById("startButton");
    const btnPause = document.getElementById("pauseButton");

    btnStart.addEventListener("click", (event) => {
        snake.Start(null, snakeTiles);
    });

    btnPause.addEventListener("click", (event) => {
        snake.Actions.PauseOrContinue();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp") {
            snake.Actions.ChangeDirection.MoveUp();
        }
        else if (e.key == "ArrowDown") {
            snake.Actions.ChangeDirection.MoveDown();
        }
        else if (e.key == "ArrowLeft") {
            snake.Actions.ChangeDirection.MoveLeft();
        }
        else if (e.key == "ArrowRight") {
            snake.Actions.ChangeDirection.MoveRight();
        }
    })

}



document.addEventListener("DOMContentLoaded", init);
