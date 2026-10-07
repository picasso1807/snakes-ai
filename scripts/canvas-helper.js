const canvasHelper = (() => {
    const canvases = {};

    const Init = (elemId, props) => {
        if(Object.keys(canvases).indexOf(elemId) > 0) {
            console.warn(`Canvas with id:${elem} already exists. Exiting`);
            return canvases[elemId];
        }
        if(!props || Object.keys(props).length === 0) {
            props = {
                _tileWidth: tileWidth,
                _scale: scale
            }
            console.warn("No properties provided, using default values", props);
        }

        const { _tileWidth, _scale } = props;
        const canvas = document.getElementById(elemId);
        const parentElement = canvas.parentElement;
        const reducedDimensions = {
            width: parentElement.clientWidth * _scale,
            height: parentElement.clientHeight * _scale
        }
        canvas.width = Math.round(reducedDimensions.width / _tileWidth) * _tileWidth;// round to title width
        canvas.height = Math.round(reducedDimensions.height / _tileWidth) * _tileWidth; // round to title height
        canvases[elemId] = canvas.getContext("2d");
        return canvases[elemId];
    }

    const drawGrids = (tileWidth) => {
        let ctxGrid = Init(gridCanvas, { _tileWidth: tileWidth, _scale: scale });
        let element = document.getElementById(gridCanvas);
        ctxGrid.beginPath();
        for (let colLine = 0; colLine <= element.clientWidth; colLine += tileWidth) {
            ctxGrid.moveTo(colLine, 0);
            ctxGrid.lineTo(colLine, element.clientHeight);
        }

        for (let rowLine = 0; rowLine <= element.clientHeight; rowLine += tileWidth) {
            ctxGrid.moveTo(0, rowLine);
            ctxGrid.lineTo(element.clientWidth, rowLine);
        }
        ctxGrid.strokeStyle = "#ececec";
        ctxGrid.stroke();
    }

    return {
        init: Init,
        drawGrids
    }
})();