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
            cell.id = `cell-${i}-${j}`;
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
    console.log('Cell clicked at ' + x + ', ' + y + ' on board: ' + name);
}

// Randomly place ships for computer
function placeShips(board) {
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
                console.log('orientation: ' + orientation + ' at ' + x + ', ' + y);

                if (orientation == 'horizontal') {
                    for (let i = 0; i < length; i++) {
                        board[x][y + i].ship = true;
                        document.getElementById(`cell-${x}-${y + i}`).classList.add('ship');
                    }
                } else {
                    for (let i = 0; i < length; i++) {
                        board[x + i][y].ship = true;
                        document.getElementById(`cell-${x + i}-${y}`).classList.add('ship');
                    }
                }
                is_placed = true;
            }
            
        }
    }
    console.log(board);
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

const grid_size = 10;
const ship_lengths = [5, 4, 3, 3, 2];
const player_gameboard = initializeGameBoard();
const computer_gameboard = initializeGameBoard();

gridSetup('grid-player-container', player_gameboard, 'Player Board');
gridSetup('grid-computer-container', computer_gameboard, 'Computer Board');

placeShips(computer_gameboard);
