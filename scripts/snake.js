const snake = (() => {
    let _position = [];
    let snakeState = STATES.STOPPED;
    let currentDirection = null;
    let runningInstance = -1;
    let _snakeTiles = null; 
    let max = {
        height: null,
        width: null
    }
    const DIRECTIONS = {
        TOP: 0,
        RIGHT: 1,
        BOTTOM: 2,
        LEFT: 3
    }

    let _onErrorEvent= null;

    const getToggleColor = (color) => {
        if (color == "white")
            return "green";
        else 
            return "white";
    }

    const OnError = (callback) => {
        _onErrorEvent = (msg) => {
            let ctx = canvasHelper.init(gameCanvas);
            let canv = document.getElementById("gameCanvas");
            let blinkCount = 0;
            let isClear = true;
            let color = "green";
            const maxBlinks = 12; // Adjust this to how many times you want it to flash
            let interval = setInterval(() => {
                if(isClear) {
                    ctx.fillStyle = "black";
                    ctx.globalAlpha = 0.7;
                    ctx.fillRect(0, 0, canv.clientWidth, canv.clientHeight);
                }
                else {
                    ctx.clearRect(0, 0, canv.clientWidth, canv.clientHeight);
                }
                isClear = !isClear;
                color = getToggleColor(color);
                ctx.fillStyle = color;
                ctx.globalAlpha = 1;
                for (const positionTile of _position) {
                    ctx.fillRect(positionTile.x, positionTile.y, tileWidth, tileWidth);
                }
                ctx.stroke();
                blinkCount++;
                if (blinkCount >= maxBlinks) {
                    clearInterval(interval);
                    callback(msg); // Run your callback here after blinking finishes
                }
            }, 250);
            
            // callback(msg);
        }
    } 

    const setPosition = (oldPosition, movementDirection) => {
        let lastPosition = oldPosition[oldPosition.length - 1];
        let x = Number(lastPosition.x);
        let y = Number(lastPosition.y);

        let verticalEnd = y >= max.height;
        let horizontalEnd = x >= max.width;
        if (verticalEnd || horizontalEnd) {
            x = horizontalEnd ? 0 : x;
            y = verticalEnd ? 0 : y;
        }
        else {
            switch (movementDirection) {
                case DIRECTIONS.LEFT:
                    if (currentDirection == movementDirection || currentDirection == DIRECTIONS.TOP || currentDirection == DIRECTIONS.BOTTOM)// moving vertically
                        x = x - tileWidth;
                    break;
                case DIRECTIONS.RIGHT:
                    if (currentDirection == movementDirection || currentDirection == DIRECTIONS.TOP || currentDirection == DIRECTIONS.BOTTOM)// moving vertically
                        x = x + tileWidth;
                    break;
                case DIRECTIONS.TOP:
                    if (currentDirection == movementDirection || currentDirection == DIRECTIONS.RIGHT || currentDirection == DIRECTIONS.LEFT)// moving horizontally
                        y = y - tileWidth;
                    break;
                case DIRECTIONS.BOTTOM:
                    if (currentDirection == movementDirection || currentDirection == DIRECTIONS.RIGHT || currentDirection == DIRECTIONS.LEFT)// moving horizontally
                        y = y + tileWidth;
                    break;
            }
        }
        oldPosition.push({ x, y });        

        let lostTailPosition = null;
        if (oldPosition.length > _snakeTiles)
            lostTailPosition = oldPosition.shift();
        // for collision at least snake should be atleast 5 long
        if (oldPosition.length > 4 && oldPosition.slice(0, -1).some((coordinates) => coordinates.x == x && coordinates.y == y)) {
            PauseOrContinue();
            // Stop();
            _onErrorEvent("Snake ate itself");
        }
        if (x == 0 && y == 0)
            lastPosition = null;

        return { position: oldPosition, lostTailPosition };
    }

    const render = (canvasContext, lostTailPosition) => {
        for (const positionTile of _position) {
            canvasContext.fillRect(positionTile.x, positionTile.y, tileWidth, tileWidth);
        }

        if (lostTailPosition)
            canvasContext.clearRect(lostTailPosition.x, lostTailPosition.y, tileWidth, tileWidth);

        canvasContext.stroke();
    }

    /**
     * start the snake from the specified tile or default position {0,0}
     * @param {{x: number, y: number}} startTiles
     */
    const Start = (startTiles, snakeTiles) => {
        if (runningInstance)
            clearInterval(runningInstance);
        startTiles = startTiles ?? { x: 0, y: 0 };
        _snakeTiles = snakeTiles;

        let ctx = canvasHelper.init(gameCanvas);
        max.height = document.getElementById(gameCanvas).height;
        max.width = document.getElementById(gameCanvas).width;
        ctx.moveTo(startTiles.x, startTiles.y);
        ctx.fillStyle = "green";

        _position.length = 0; // reset array
        _position.push(startTiles);

        let lostTailPosition = null;
        snakeState = STATES.RUNNING;
        currentDirection = currentDirection ?? DIRECTIONS.RIGHT;
        runningInstance = setInterval(() => {
            if (snakeState == STATES.RUNNING) {
                let updatedLocation = setPosition(_position, currentDirection);
                render(ctx, lostTailPosition);
                _position = updatedLocation.position;
                lostTailPosition = updatedLocation.lostTailPosition;
            }
        }, snakeSpeed);
    }

    const PauseOrContinue = () => {
        if (snakeState == STATES.PAUSE) {
            snakeState = STATES.RUNNING;
        }
        else {
            snakeState = STATES.PAUSE;
        }
    }

    const Stop = () => {
        snakeState = STATES.STOPPED;
        clearInterval(runningInstance);
        _position = [{ x: 0, y: 0 }];
    }

    const ChangeDirection = {
        MoveUp: () => { 
            if ([DIRECTIONS.TOP, DIRECTIONS.BOTTOM].indexOf(currentDirection) == -1)
                currentDirection = DIRECTIONS.TOP; 
        },
        MoveDown: () => { 
            if ([DIRECTIONS.TOP, DIRECTIONS.BOTTOM].indexOf(currentDirection) == -1)
                currentDirection = DIRECTIONS.BOTTOM; 
        },
        MoveLeft: () => { 
            if ([DIRECTIONS.RIGHT, DIRECTIONS.LEFT].indexOf(currentDirection) == -1)
                currentDirection = DIRECTIONS.LEFT;
        },
        MoveRight: () => { 
             if ([DIRECTIONS.RIGHT, DIRECTIONS.LEFT].indexOf(currentDirection) == -1)
                currentDirection = DIRECTIONS.RIGHT; 
        }
    }

    return {
        Start,
        State: snakeState,
        Position: _position,
        Actions: {
            Stop,
            PauseOrContinue,
            ChangeDirection
        },
        OnError
    }
})();