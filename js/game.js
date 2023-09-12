const canvas = document.getElementById('game');
const game = canvas.getContext('2d');
const btnUp = document.getElementById('up');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const btnDown = document.getElementById('down');

let canvasSize;
let elementSize;

const playerPosition = {
    x: undefined,
    y: undefined
};

const gift = {
    x: undefined,
    y: undefined
}

const bomb = {
    x: undefined,
    y: undefined
}

let level = 0;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
// Click en los botones
btnUp.addEventListener('click', fnUp);
btnLeft.addEventListener('click', fnLeft);
btnRight.addEventListener('click', fnRight);
btnDown.addEventListener('click', fnDown);
// Presionando el teclado
window.addEventListener('keydown', fnPress);

function setCanvasSize() {
    canvasSize = (window.innerHeight > window.innerWidth)
        ? window.innerWidth * 0.8
        : window.innerHeight * 0.8;

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = canvasSize / 10;

    startGame();
}

function startGame() {
    game.font = `${elementSize}px Verdana`;
    game.textAlign = 'end';
    const map = maps[level];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    game.clearRect(0, 0, canvasSize, canvasSize);
    // Borra el mapa

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1);

            if (col === 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col === 'I') {
                gift.x = posX;
                gift.y = posY;
            } else if (col == 'X') {
                bomb.x = posX;
                bomb.y = posY;
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    // const giftCollisionX = playerPosition.x == gift.x;
    // const giftCollisionY = playerPosition.y == gift.y;
    // const giftCollision = giftCollisionX && giftCollisionY;

    // const bombCollisionX = playerPosition.x == bomb.x;
    // const bombCollisionY = playerPosition.y == bomb.y;
    // const bombCollision = bombCollisionX && bombCollisionY;



    // if (giftCollision) {
    //     console.log("Subiste de Nivel");
    // } else if (bombCollision) {
    //     console.warn('Perdiste');
    // }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function fnUp() {
    // console.log('Arriba');

    if ((playerPosition.y - elementSize) < elementSize) {
        console.warn('UPS');
    } else {
        playerPosition.y -= elementSize;
        startGame();
    }
}

function fnLeft() {
    console.log('Izquierdo');
    if ((playerPosition.x - elementSize) < elementSize) {
        console.warn('UPS');
    } else {
        playerPosition.x -= elementSize;
        startGame();
    }
}

function fnRight() {
    console.log('Derecho');
    if ((playerPosition.x + elementSize) > canvasSize) {
        console.warn('UPS');
    } else {
        playerPosition.x += elementSize;
        startGame();
    }
}

function fnDown() {
    console.log('Abajo');
    if ((playerPosition.y + elementSize) > canvasSize) {
        console.warn('UPS');
    } else {
        playerPosition.y += elementSize;
        startGame();
    }
}

function fnPress(event) {
    switch (event.code) {
        case 'ArrowUp': fnUp();
            break;
        case 'ArrowLeft': fnLeft();
            break;
        case 'ArrowRight': fnRight();
            break;
        case 'ArrowDown': fnDown();
            break;
    }
}
