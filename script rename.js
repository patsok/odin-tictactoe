// function minimax(newBoard, player) {
//     let emptySpots = newBoard.map((empty, index) => {
//         if (empty == '') {
//             return index;
//         }
//         return false;
//     }).filter(empty => typeof empty == "number");
//     // let winner = gameController.checkWinCondition();
//     // if (winner == false) {
//     //     return { score: -10 };
//     // } else if (winner) {
//     //     return { score: 10 };
//     // } else if (gameController.checkTie()) {
//     //     return { score: 0 };
//     // }
//     var moves = [];
//     for (var i = 0; i < emptySpots.length; i++) {
//         var move = {};
//         // move.index = newBoard[emptySpots[i]];
//         newBoard[emptySpots[i]] = player;
//         if (player == gameController.getActivePlayer().getPlayerSign()) {
//             var result = minimax(newBoard, 'X');
//             move.score = result.score;

//         } else {
//             var result = minimax(newBoard, 'O');
//             move.score = result.score;

//         }
//         newBoard[emptySpots[i]] = move.index;
//         moves.push(move);
//     }

//     var bestMove;
//     if (player === 'O') {
//         var bestScore = -10000;
//         for (var i = 0; i < moves.length; i++) {
//             if (moves[i].score > bestScore) {
//                 bestScore = moves[i].score;
//                 bestMove = i;
//             }
//         }
//     } else {
//         var bestScore = 10000;
//         for (var i = 0; i < moves.length; i++) {
//             if (moves[i].score < bestScore) {
//                 bestScore = moves[i].score;
//                 bestMove = i;
//             }
//         }
//     }
//     return moves[bestMove];
// }

function minimax(board, player) {
    const duzaTablica = [
        // ['', 'X', '', '', '', '', '', '', '']
        ['O', 'O', 'X',
            '', 'O', '',
            'X', '', 'X'
        ]
        // ['', '', '', 'X', '', '', '', '', ''],
        // ['', '', '', '', 'X', '', '', '', ''],
        // ['', '', '', '', '', 'X', '', '', ''],
        // ['', '', '', '', '', '', 'X', '', ''],
        // ['', '', '', '', '', '', '', 'X', ''],
        // ['', '', '', '', '', '', '', '', 'X']
    ];
    duzaTablica.forEach(tablica => {
        let bestMoveScore = 0;
        let bestMoveIndex = 0;
        for (let i = 0; i < tablica.length; i++) {
            let score = 0;
            if (tablica[i] == '') {
                score = canWinDiagonally(i, 'O', tablica) + canWinRows(i, 'O', tablica) + canWinColumns(i, 'O', tablica);
                if (score > bestMoveScore) {
                    bestMoveScore = score;
                    bestMoveIndex = i;
                }
            }
        }
        console.log(bestMoveScore, bestMoveIndex)
    });
}

function canWinDiagonally(index, player, board) {
    let score = 0;
    const applicableIndexes = [0, 2, 4, 6, 8];
    if (applicableIndexes.includes(index)) {
        let substitutedBoard = [...board];
        substitutedBoard[index] = player;
        if (checkFirstDiagonal(substitutedBoard, player)) {
            score++;
        }
        if (checkSecondDiagonal(substitutedBoard, player)) {
            score++;
        };
    }
    return score;
}

function checkFirstDiagonal(board, player) {
    return (board[0] == player || board[0] == '') && (board[4] == player || board[4] == '') && (board[8] == player || board[8] == '')
}

function checkSecondDiagonal(board, player) {
    return (board[2] == player || board[2] == '') && (board[4] == player || board[4] == '') && (board[6] == player || board[6] == '')
}

function canWinRows(index, player, board) {
    let score = 0;
    const rows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];
    let searchableRow = rows.filter(row => row.includes(index))[0];
    let boardRow = [];
    let substitutedBoard = [...board];
    substitutedBoard[index] = player;
    searchableRow.forEach(rowIndex => boardRow.push(substitutedBoard[rowIndex]));
    if (checkRow(boardRow, player)) {
        score++;
    };
    return score;
}

function checkRow(row, player) {
    return (row[0] == player || row[0] == '') && (row[1] == player || row[1] == '') && (row[2] == player || row[2] == '');
}

function canWinColumns(index, player, board) {
    let score = 0;
    const columns = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ];
    let searchableColumn = columns.filter(col => col.includes(index))[0];
    let boardColumn = [];
    let substitutedBoard = [...board];
    substitutedBoard[index] = player;
    searchableColumn.forEach(columnIndex => boardColumn.push(substitutedBoard[columnIndex]));
    if (checkColumn(boardColumn, player)) {
        score++;
    };
    return score;
}

function checkColumn(column, player) {
    return (column[0] == player || column[0] == '') && (column[1] == player || column[1] == '') && (column[2] == player || column[2] == '');
}

minimax();


// function minimax(board, player) {
//     //
//     return bestMoveIndex;
// }

// function globalMaximum(board,player){

// }

// function globalMinimum(){

// }
// function localMinimum(){

// }

// function localMaximum(board, player){
//     let bestMoveScore = 0;
//     let bestMoveIndex = 0;
//     for (let i = 0; i < board.length; i++) {
//         let score = 0;
//         if (board[i] == '') {
//             score = canWinDiagonally(i, player, board) + canWinRows(i, player, board) + canWinColumns(i, player, board);
//             if (score > bestMoveScore) {
//                 bestMoveScore = score;
//                 bestMoveIndex = i;
//             }
//         }
//     }
// }

// function canWinDiagonally(index, player, board) {
//     let score = 0;
//     const applicableIndexes = [0, 2, 4, 6, 8];
//     if (applicableIndexes.includes(index)) {
//         let substitutedBoard = [...board];
//         substitutedBoard[index] = player;
//         if (checkFirstDiagonal(substitutedBoard, player)) {
//             score++;
//         }
//         if (checkSecondDiagonal(substitutedBoard, player)) {
//             score++;
//         };
//     }
//     return score;
// }

// function checkFirstDiagonal(board, player) {
//     return (board[0] == player || board[0] == '') && (board[4] == player || board[4] == '') && (board[8] == player || board[8] == '')
// }

// function checkSecondDiagonal(board, player) {
//     return (board[2] == player || board[2] == '') && (board[4] == player || board[4] == '') && (board[6] == player || board[6] == '')
// }

// function canWinRows(index, player, board) {
//     let score = 0;
//     const rows = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8]
//     ];
//     let searchableRow = rows.filter(row => row.includes(index))[0];
//     let boardRow = [];
//     let substitutedBoard = [...board];
//     substitutedBoard[index] = player;
//     searchableRow.forEach(rowIndex => boardRow.push(substitutedBoard[rowIndex]));
//     if (checkRow(boardRow, player)) {
//         score++;
//     };
//     return score;
// }

// function checkRow(row, player) {
//     return (row[0] == player || row[0] == '') && (row[1] == player || row[1] == '') && (row[2] == player || row[2] == '');
// }

// function canWinColumns(index, player, board) {
//     let score = 0;
//     const columns = [
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8]
//     ];
//     let searchableColumn = columns.filter(col => col.includes(index))[0];
//     let boardColumn = [];
//     let substitutedBoard = [...board];
//     substitutedBoard[index] = player;
//     searchableColumn.forEach(columnIndex => boardColumn.push(substitutedBoard[columnIndex]));
//     if (checkColumn(boardColumn, player)) {
//         score++;
//     };
//     return score;
// }

// function checkColumn(column, player) {
//     return (column[0] == player || column[0] == '') && (column[1] == player || column[1] == '') && (column[2] == player || column[2] == '');
// }