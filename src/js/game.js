const canvas = document.getElementById('game');
const game = canvas.getContext('2d');
const gameLoad = document.getElementById('gameLoad');
const btnStartGame = document.getElementById('startGame');
const divInfo = document.getElementById('info');
const btnUp = document.getElementById('up');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const btnDown = document.getElementById('down');
const spanLives = document.getElementById('lives');
const spanTime = document.getElementById('time');
const spanRecord = document.getElementById('record');
const pResult = document.getElementById('result');
const btnArrows = document.getElementById('btns');

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

let enemyPositions = [];

let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

window.addEventListener('load', info);
if (gameLoad.getAttribute('class') !== 'game-container hidden') {
    window.addEventListener('resize', setCanvasSize);
}
function info() {
    gameLoad.classList.add('hidden');
    btnStartGame.addEventListener('click', setCanvasSize);
}

function setCanvasSize() {
    window.addEventListener('resize', setCanvasSize);
    gameLoad.classList.remove('hidden');
    divInfo.classList.add('hidden');

    moveArrows();

    canvasSize = (window.innerHeight > window.innerWidth)
        ? window.innerWidth * 0.7
        : window.innerHeight * 0.7;
    canvasSize = Number(canvasSize.toFixed(0));
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = canvasSize / 10;
    elementSize = Number(elementSize.toFixed());
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    showLives();
    game.font = `${elementSize}px Verdana`;
    game.textAlign = 'end';
    let map = maps[level];

    if (!map) {
        level = maps.length - 1;
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    enemyPositions = [];
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
                enemyPositions.push({
                    x: posX,
                    y: posY
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    const giftCollisionX = Number(playerPosition.x.toFixed()) === Number(gift.x.toFixed());
    const giftCollisionY = Number(playerPosition.y.toFixed()) === Number(gift.y.toFixed());
    const giftCollision = giftCollisionX && giftCollisionY;

    console.log({ giftCollisionX, giftCollisionY });

    if (giftCollision) {
        levelWin();
    }

    const enemyCollision = enemyPositions.find(function (enemy) {
        return Number(enemy.x.toFixed()) == Number(playerPosition.x.toFixed()) && Number(enemy.y.toFixed()) == Number(playerPosition.y.toFixed());
    })

    if (enemyCollision) {
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel!');
    level++;
    startGame();
}

function levelFail() {
    console.warn('Perdiste 😒');
    lives--;
    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
        clearInterval(timeInterval);
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    const playerTime = (Date.now() - timeStart) / 1000;
    const recordTime = localStorage.getItem('record_time');

    console.log('Felicitaciones Haz terminado el juego 😁');
    clearInterval(timeInterval);
    canvas.classList.add('hidden');
    btnArrows.classList.add('hidden');
    divInfo.classList.remove('hidden');
    document.getElementById('game-over').innerHTML = `<img src="./img/gameOver.png" alt="">`;

    if (recordTime) {
        if (recordTime > playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE TU RECORD 🏆';
        } else {
            pResult.innerHTML = 'Lo siento no superaste tú record 😢';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
    }
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);// Crea un array con la cantidad de vidas
    spanLives.innerHTML = '';
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function moveArrows() {
    // Click en los botones
    btnUp.addEventListener('click', fnUp);
    btnLeft.addEventListener('click', fnLeft);
    btnRight.addEventListener('click', fnRight);
    btnDown.addEventListener('click', fnDown);
    // Presionando el teclado
    window.addEventListener('keydown', fnPress);
}

function fnUp() {
    console.log(playerPosition.y, playerPosition.x)
    if ((playerPosition.y - elementSize) < elementSize) {
        console.warn('UPS');
    } else {
        playerPosition.y -= elementSize;
        startGame();
    }
}

function fnLeft() {
    console.log('Izquierdo');
    console.log(playerPosition.x);
    if ((playerPosition.x - elementSize) < elementSize) {
        console.warn('UPS');
    } else {
        playerPosition.x -= elementSize;
        startGame();
    }
}

function fnRight() {
    console.log('Derecho');
    console.log(playerPosition.x);
    if ((playerPosition.x + elementSize) > canvasSize) {
        console.warn('UPS');
    } else {
        playerPosition.x += elementSize;
        startGame();
    }
}

function fnDown() {
    console.log('Abajo');
    console.log(playerPosition.y);
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
