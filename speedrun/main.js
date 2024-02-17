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

    addMessage('Player shot at [x: ' + x + ' y: ' + y + '].');
//    console.log(computer_gameboard);
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
    setTimeout(3000);
        addMessage('Player Turn! Select a cell.');

        // adds event listener to computer grid
        document.querySelectorAll("[data-board='grid-computer-container']").forEach(cell => {
            cell.addEventListener('click', function(event) {
                const x = parseInt(event.target.dataset.x);
                const y = parseInt(event.target.dataset.y);
                const isShip = computer_gameboard[x][y].ship;
                
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
                    console.log('Player Wings!');
                } else {
                    currentPalyer = 'computer';
                    computerTurn();
                }  
    
            });
        });

        // check if game is over


}

function computerTurn() {

    addMessage('Computer Turn!');
    
    setTimeout(3000);
    // randomly selects a cell
    const x = Math.floor(Math.random() * grid_size);
    const y = Math.floor(Math.random() * grid_size);

    if (player_gameboard[x][y].hit == false) {
        const ship_circle = document.createElement('div');
        ship_circle.classList.add('ship-circle');
        document.getElementById(`cell-${x}-${y}-grid-player-container`).appendChild(ship_circle);
        
        player_gameboard[x][y].hit = true;
        ship_circle.style.display = 'block';

        if (player_gameboard[x][y].ship) {
            
            const ship_id = player_gameboard[x][y].ship_id;
            console.log('Computer destroyed player\'s ship ' + ship_id);

            if (isShipDestroyed(ship_id, player_gameboard)) {
                console.log('Computer destroyed player\'s ship ' + ship_id);
                highlightDestroyedShip(ship_id, player_gameboard, 'grid-player-container');
            }
        }

        if (isGameOver(player_gameboard)) {
            console.log('Computer wings!');
        } else {
            currentPlayer = 'player';
            playerTurn();
        }
    }
}

function isShipDestroyed(ship_id, board) {
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            if (board[i][j].ship && board[i][j].ship_id == ship_id && !board[i][j].hit) {
                return false;
            }
        }
    }
    return true;
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
let currentTurn = 'player';
let next_ship_id = 1;

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
