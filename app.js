/* For board generation ui
for (i = 0; i < col; i++) {
    for (j = 0; j < row; j++) {

        var cell = document.createElement("div");
        pc_gameboard.appendChild(cell);
    }
}
*/

function generateBoard(board, ships) {
    let x1, y1, x2, y2;

    for (let i = 0; i < ships.length; i++) {
        const is_vertical = Math.random() < 0.5;
        const ship_length = ships[i];
        let isValid = false;

        while (!isValid) {
            console.log(ship_length);
            x1 = Math.floor(Math.random() * 10);
            y1 = Math.floor(Math.random() * 10);

            if (is_vertical) {
                x2 = x1;
                y2 = y1 + ship_length;
                if (y2 <= 9) {
                    isValid = true;
                    for (let j = y1; j < y2; j++) {
                        if (!checkCell(board, x1, j)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        placeVerticalShip(board, x1, y1, y2, ship_length);
                    }
                }

            } else {
                x2 = x1 + ship_length;
                y2 = y1;
                if (x2 <= 9) {
                    isValid = true;
                    for (let j = x1; j < x2; j++) {
                        if (!checkCell(board, j, y1)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        placeHorizontalShip(board, x1, y1, x2, ship_length);
                    }
                }
            }
        }
    }
}

function checkCell(board, x, y) {
    if (board[x][y] != 0) {
        return false
    }
    return true
}

function placeVerticalShip(board, x1, y1, y2, z) {
    for (i = y1; i < y2; i++) {
        board[i][x1] =z;
    }
}

function placeHorizontalShip(board, x1, y1, x2, z) {
    for (i = x1; i < x2; i++) {
        board[y1][i] = z;
    }
}

function handleClick() {

}

var row = 10;
var col = 10;

var carrier = 5;
var battleship = 4;
var destroyer = 3;
var submarine = 3;
var patrol_boat = 2;

var ships = [carrier, battleship, destroyer, submarine, patrol_boat]

var player_gameboard = document.getElementById("playerboard")
var pc_gameboard = document.getElementById("pcboard")

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

generateBoard(pc_array_board, ships);
console.log(pc_array_board);

//pc_gameboard.addEventListener("click", handleClick, false);