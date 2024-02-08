/* For board generation ui
for (i = 0; i < col; i++) {
    for (j = 0; j < row; j++) {

        var cell = document.createElement("div");
        pc_gameboard.appendChild(cell);
    }
}
*/

function placeShip(board, x1, y1, x2, y2, ship_length) {
    if (x1 === x2) { // Vertical ship
        for (let i = y1; i < y2; i++) {
            board[x1][i] = 1;
        }
    } else { // Horizontal ship
        for (let i = x1; i < x2; i++) {
            board[i][y1] = 1;
        }
    }
}

function createPlayerGameBoard() {
    const gameBoard = document.getElementById('playerboard');
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.classList.add('player-cell');
            gameBoard.appendChild(cell);
        }
    }
}

function createComputerGameBoard() {
    const gameBoard = document.getElementById('pcboard');
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.classList.add('pc-cell');
            gameBoard.appendChild(cell);
        }
    }
}

function generatePCBoard(board, ships) {
    let x1, y1, x2, y2;

    for (let i = 0; i < ships.length; i++) {
        const is_vertical = Math.random() < 0.5;
        const ship_length = ships[i];
        let isValid = false;

        while (!isValid) {
            x1 = Math.floor(Math.random() * 10);
            y1 = Math.floor(Math.random() * 10);

            if (is_vertical) {
                x2 = x1;
                y2 = y1 + ship_length;
                if (y2 <= 10) {
                    isValid = true;
                    for (let j = y1; j < y2; j++) {
                        if (!checkCell(board, x1, j)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        placeShip(board, x1, y1, x2, y2, ship_length);
                    }
                }
            } else {
                x2 = x1 + ship_length;
                y2 = y1;
                if (x2 <= 10) {
                    isValid = true;
                    for (let j = x1; j < x2; j++) {
                        if (!checkCell(board, j, y1)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        placeShip(board, x1, y1, x2, y2, ship_length);
                    }
                }
            }
        }
    }

    return board;
}

function checkCell(board, x, y) {
    if (board[x][y] != 0) {
        return false
    }
    return true
}

function handleClick(event) {
    const clicked_cell = event.target;
    const coordinates = getCellCoordinates(clicked_cell);
    const row = coordinates[0];
    const col = coordinates[1];
    console.log("row: " + row);
    console.log('column: ' + col);
    const msg = document.getElementById('message-list');
    const circle = document.createElement('div');
    const message = document.createElement('p');
    message.classList.add('messages');
    circle.classList.add('hit-circle');

    if (pc_array_board[row][col] == 2) {
        message.textContent = "You have already sunken that part of a ship! (Try another spot).";
        msg.appendChild(message);
    } else if (pc_array_board[row][col] == 3) {
        message.textContent = "You shot at that location already and missed! (Try another spot).";
        msg.appendChild(message);
    } else {
        if (pc_array_board[row][col] == 1) {
            clicked_cell.style.backgroundColor = 'red';
            clicked_cell.appendChild(circle);
            pc_array_board[row][col] = 2;
            counter++;
    
        } else {
            clicked_cell.style.backgroundColor = '#c7c7c7';
            clicked_cell.appendChild(circle);
            pc_array_board[row][col] = 3;
        }
    }

    if (counter == 17) {
        message.textContent = "You have won the game!";
        message.classList.add('winner-text');
        msg.appendChild(message);
        pc_gameboard.removeEventListener("click", handleClick);
        return; 
    }
}


function playerSetup(shipElements, ship_lengths) {
    shipElements.forEach((shipElement, index) => {
        const shipLength = ship_lengths[index];
        const shipName = shipElement.id;
        console.log(shipName);


        const shipContainer = document.createElement('div');
        shipContainer.classList.add('ship-container');


        // Create cells for the ship
        for (let j = 0; j < shipLength; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // Add classes for visual representation if needed
            shipContainer.appendChild(cell);
        }
        
        // Make the ship draggable
        shipElement.setAttribute('draggable', true);
        shipElement.addEventListener('dragstart', dragStart);
        shipElement.addEventListener('dragend', dragEnd)

        // Append ship container to the parent element
        shipElement.appendChild(shipContainer);
    });

    player_gameboard.addEventListener('dragover', dragOver);
    player_gameboard.addEventListener('drop', drop);
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', this.id);
}

function dragEnd() {
    draggedShip = null;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (!draggedShip) {
        return;
    }

    const playerBoard = document.getElementById('playerboard');
    const cell = event.target.closest('.cell');

    // Ensure the target is a cell and belongs to the player board
    if (cell && playerBoard.contains(cell)) {
        console.log("cell works");
        const ship_id = draggedShip.id;
        const shipLength = getShipLength(ship_id);
        const [x, y] = getCellCoordinates(cell);

        // Remove any existing ship cells in the area
        const existingShipCells = document.querySelectorAll('.player-cell.ship-cell');
        existingShipCells.forEach(cell => {
            cell.classList.remove('ship-cell');
        });

        // Place the ship on the player board
        for (let i = 0; i < shipLength; i++) {
            const newX = x + (i % shipLength);
            const newY = y + Math.floor(i / shipLength);
            const boardCell = document.querySelector(`.player-cell[data-row='${newX}'][data-col='${newY}']`);
            boardCell.classList.add('ship-cell');
        }
    }
}

function getShipLength(ship_id) {
    if (ship_id == 'carrier')       return 5;
    if (ship_id == 'battleship')    return 4;
    if (ship_id == 'destroyer')     return 3;
    if (ship_id == 'submarine')     return 3;
    if (ship_id == 'patrol_boat')   return 2;
    return 0; 
}



function getCellCoordinates(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    return [row, col];
}

function startGame(){
    pc_gameboard.addEventListener("click", handleClick);
}


var counter = 0;
var row = 10;
var col = 10;

var carrier = 5;
var battleship = 4;
var destroyer = 3;
var submarine = 3;
var patrol_boat = 2;
let draggedShip;

var ships = [carrier, battleship, destroyer, submarine, patrol_boat]

var player_gameboard = document.getElementById("playerboard")
var pc_gameboard = document.getElementById("pcboard")
var player_ships = document.querySelectorAll('.ship');

player_array_board = [ 
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

pc_array_board = [ 
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

createPlayerGameBoard();
createComputerGameBoard();
generatePCBoard(pc_array_board, ships);
playerSetup(player_ships, ships);
console.log(pc_array_board);

startGame();