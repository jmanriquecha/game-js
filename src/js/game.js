const canvas = document.getElementById('game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function startGame() {
    game.font = `${elementSize}px Verdana`;
    game.textAlign = 'end';

    const map = maps[2];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    console.log({ mapRows, mapRowCols });

    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10; col++) {
            game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementSize * col, elementSize * row);
        }
    }
}

function setCanvasSize() {
    canvasSize = (window.innerHeight > window.innerWidth)
        ? window.innerWidth * 0.8
        : window.innerHeight * 0.8;

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = canvasSize / 10;

    startGame();
}