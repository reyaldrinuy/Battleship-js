// Generate Battelship gridsa
/*
function computerGrid() {
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            const cell = document.createElement('div');
            cell.classList.add("grid-cell");
            cell.addEventListener("click", cellClick);
            grid_computer_container.appendChild(cell);
        }
    }
}

function playerGrid() {
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            const cell = document.createElement('div');
            cell.classList.add("grid-cell");
            cell.addEventListener("click", cellClick);
            grid_player_container.appendChild(cell);
        }
    }
}
*/

function initializeGameBoard() {
    let gameBoard = [];
    for (let i = 0; i < grid_size; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < grid_size; j++) {
            gameBoard[i][j] = {
                ship: false,
                hit: false
            };
        }
    }
    return gameBoard;
}

function gridSetup(container, board, board_name) {
    const grid_container = document.getElementById(container);
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.dataset.board = board_name;
            cell.addEventListener('click', function(event){
                cellClick(event, board)
            });
            cell.id = `cell-${i}-${j}-${board_name}`;
            grid_container.appendChild(cell);
        }
    }
}

// Handle cell click event
function cellClick(event){
    const cell = event.target;
    const x = cell.dataset.x;
    const y = cell.dataset.y;
    const name = cell.dataset.board;

}

function enablePlayerClick() {
    document.querySelectorAll("[data-board='grid-computer-container']").forEach(cell => {
        cell.addEventListener('click', cellClick);
    });
}

function disablePlayerClick() {
    document.querySelectorAll("[data-board='grid-computer-container']").forEach(cell => {
        //console.log(cell);
        cell.removeEventListener('click', cellClick);
    });
}

// Randomly place ships for computer
function placeShips(board, board_name) {
    for (let length of ship_lengths) {
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let x, y;
        let is_placed = false;
        while (!is_placed) {
            if (orientation == 'horizontal') {
                x = Math.floor(Math.random() * grid_size);
                y = Math.floor(Math.random() * (grid_size - length + 1));
            } else {
                x = Math.floor(Math.random() * (grid_size - length + 1));
                y = Math.floor(Math.random() * grid_size);
            }

            if (checkShipPlacement(x, y, length, orientation, board)) {
                const ship_id = next_ship_id++;
                if (orientation == 'horizontal') {
                    for (let i = 0; i < length; i++) {
                        board[x][y + i].ship = true;
                        board[x][y + i].ship_id = ship_id;
                        document.getElementById(`cell-${x}-${y + i}-${board_name}`).classList.add(board === player_gameboard ? 'player-ship' : 'computer-ship');
                    }
                } else {
                    for (let i = 0; i < length; i++) {
                        board[x + i][y].ship = true;
                        board[x + i][y].ship_id = ship_id;
                        document.getElementById(`cell-${x + i}-${y}-${board_name}`).classList.add(board === player_gameboard ? 'player-ship' : 'computer-ship');
                    }
                }
                is_placed = true;
            }
        }
    }
}

function checkShipPlacement(x, y, length, orientation, board) {
    if (orientation == 'horizontal') {
        for (let i = 0; i < length; i++) {
            if (board[x][y+i].ship) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < length; i++) {
            if (board[x+i][y].ship) {
                return false;
            }
        }
    }
    return true;
}

function playerTurn() {

    if (!is_playerTurn) {
        return;
    }

    setTimeout(function() {
        // adds event listener to computer grid
        //enablePlayerClick();
        addMessage('- Player Turn! Select a cell.');
        document.querySelectorAll("[data-board='grid-computer-container']").forEach(cell => {
            
            cell.addEventListener('click', function(event) {
                const x = parseInt(event.target.dataset.x);
                const y = parseInt(event.target.dataset.y);
                const isShip = computer_gameboard[x][y].ship;
                addMessage('Player shot at [x: ' + x + ' y: ' + y + '].');

                // add circles on each cell to notify they got hit
                if (computer_gameboard[x][y].hit == false) {
                    const ship_circle = document.createElement('div');
                    ship_circle.classList.add('ship-circle');
                    event.target.appendChild(ship_circle);
    
                    computer_gameboard[x][y].hit = true;
                    ship_circle.style.display = 'block';
                } 
                if (isShip) {
                    const ship_id = computer_gameboard[x][y].ship_id;
                    if (isShipDestroyed(ship_id, computer_gameboard)) {
                        highlightDestroyedShip(ship_id, computer_gameboard, 'grid-computer-container');
                    }
                }

                if (isGameOver(computer_gameboard)) {
                    console.log('Player wins!');
                } else {
                    is_playerTurn = false;
                    computerTurn();
                }  
    
            });
        });
    }, 500); // 3000 milliseconds delay
}

function computerTurn() {
    if (is_playerTurn) {
        return;
    }

    //disablePlayerClick();
    addMessage('- Computer Turn!');
    setTimeout(function() {
        // Randomly selects a cell
        const x = Math.floor(Math.random() * grid_size);
        const y = Math.floor(Math.random() * grid_size);
        addMessage('Computer shot at [x: ' + x + ', y: ' + y +']');

        if (player_gameboard[x][y].hit == false) {
            const ship_circle = document.createElement('div');
            ship_circle.classList.add('ship-circle');
            document.getElementById(`cell-${x}-${y}-grid-player-container`).appendChild(ship_circle);
            
            player_gameboard[x][y].hit = true;
            ship_circle.style.display = 'block';

            if (player_gameboard[x][y].ship) {
                const ship_id = player_gameboard[x][y].ship_id;

                if (isShipDestroyed(ship_id, player_gameboard)) {
                    switch (ship_id) {
                        case 6:
                            addMessage('Computer\'s CARRIER has been destroyed!');
                            break;
                        case 7:
                            addMessage('Computer\'s BATTLESHIP has been destroyed!');
                            break;
                        case 8:
                            addMessage('Computer\'s CRUISER has been destroyed!');
                            break;
                        case 9:
                            addMessage('Computer\'s CRUISER has been destroyed!');
                            break;
                        case 10:
                            addMessage('Computer\'s DESTROYER has been destroyed!');
                            break;
                    }
                    highlightDestroyedShip(ship_id, player_gameboard, 'grid-player-container');
                }
            }

            if (isGameOver(player_gameboard)) {
                console.log('Computer wins!');
            } else {
                is_playerTurn = true;
                playerTurn();
            }
        } else {
            // If the computer hits a cell that's already been hit, try again
            computerTurn();
        }
    }, 2000); // 2000 milliseconds delay
}

function isShipDestroyed(ship_id, board) {
    console.log(ship_id);
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            if (board[i][j].ship && board[i][j].ship_id == ship_id && !board[i][j].hit) {
                return false;
            }
        }
    }

    return true;
}

function highlightDestroyedShip(ship_id, gameboard, containerId) {
    // Find the ship's cells on the gameboard
    const shipCells = [];
    for (let i = 0; i < gameboard.length; i++) {
        for (let j = 0; j < gameboard[i].length; j++) {
            if (gameboard[i][j].ship && gameboard[i][j].ship_id === ship_id) {
                shipCells.push({ x: i, y: j });
            }
        }
    }

    // Highlight the ship's cells in the grid
    const container = document.getElementById(containerId);
    console.log(shipCells);
    shipCells.forEach(cell => {
        const cellElement = container.querySelector(`[data-x="${cell.x}"][data-y="${cell.y}"]`);
        if (cellElement) {
            cellElement.classList.add('destroyed'); // Apply CSS class to highlight destroyed ship
        }
    });
}

function isGameOver(board) {
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            if (board[i][j].ship && !board[i][j].hit) {
                return false; // At least one ship is still intact
            }
        }
    }
    return true; // All ships are destroyed
}

// Begins function for selecting computer cells
function startGame() {
    // User message; commence game!
    addMessage('Begin!');
    has_started = true;

    // begin turns
    playerTurn();
}

function addMessage(text) {
    const message_box = document.getElementById('message-container');
    const message = document.createElement('div');
    const heading = document.createElement('h4');
    heading.textContent = text;
    message.appendChild(heading);
    message.classList.add('message');
    message_box.appendChild(message);
}

// some initializations
const grid_size = 10;
const ship_lengths = [5, 4, 3, 3, 2];
const player_gameboard = initializeGameBoard();
const computer_gameboard = initializeGameBoard();
let has_started = false;
let next_ship_id = 1;
let is_playerTurn = true;

//console.log(player_gameboard);
//console.log(computer_gameboard);

// setting up grids for player and computer
gridSetup('grid-player-container', player_gameboard, 'grid-player-container');
gridSetup('grid-computer-container', computer_gameboard, 'grid-computer-container');

// placing the ships for player and comptuer
placeShips(player_gameboard, 'grid-player-container');
placeShips(computer_gameboard, 'grid-computer-container');

//console.log(player_gameboard);
//console.log(computer_gameboard);

// some code to add functionality of a start button
document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('start-button').style.display = 'none';
    startGame();
});
