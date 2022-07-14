const displayController = (function() {
    function displayBoardState(gameBoardState) {
        const singleField = document.querySelectorAll('.single-field>p');
        for (let i = 0; i < gameBoardState.length; i++) {
            singleField[i].textContent = gameBoardState[i];
        }
    }
    return { displayBoardState };
})()

const gameBoard = (function() {
    let gameBoardState = ['', '', '', '', '', '', '', '', ''];
    displayController.displayBoardState(gameBoardState);
    const setGameBoardState = () => {
        gameBoardState = ['', '', '', '', '', '', '', '', ''];
    }
    const getGameBoardState = () => {
        return gameBoardState;
    }


    return { getGameBoardState, setGameBoardState };
})()

const gameController = (function() {
    const getUserChoice = (() => {
        const singleField = document.querySelectorAll('.single-field')
        singleField.forEach((field, i) => {
            field.addEventListener('click', () => makeMove(i))
        });
    })()
    const getActivePlayer = () => {
        if (patryk.getActivePlayer() == true) {
            activePlayer = patryk;
        } else {
            activePlayer = computer;
        }
        return activePlayer;
    }
    const changeActivePlayer = () => {
        if (patryk.getActivePlayer() == true) {
            computer.setActivePlayer(true);
            patryk.setActivePlayer(false);
        } else {
            computer.setActivePlayer(false);
            patryk.setActivePlayer(true);
        }
    }
    const makeMove = (i) => {
        document.querySelector('.controls>p').textContent = '';
        if (gameBoard.getGameBoardState()[i] == '') {
            gameBoard.getGameBoardState()[i] = getActivePlayer().getPlayerSign();
            displayController.displayBoardState(gameBoard.getGameBoardState());
            changeActivePlayer();
            if (gameController.checkWinCondition() || gameController.checkTie()) {
                gameBoard.setGameBoardState();

            }
        }
    }
    const checkWinCondition = () => {
        let gameBoardStateMatrix = [];
        let arr = [];
        let gameBoardState = gameBoard.getGameBoardState();
        for (let i in gameBoardState) {
            arr.push(gameBoardState[i]);
            if (i % 3 == 2) {
                gameBoardStateMatrix.push(arr);
                arr = [];
            }
        }
        const checkRow = (board) => {
            for (let i = 0; i < 3; i++) {
                if (checkSingleRow(board[i])) {
                    return true;
                }
            }
        }
        const checkSingleRow = (row) => {
            return row[0] == row[1] && row[0] == row[2] && row[0] != '';
        }
        const checkDiagonal = (board) => {
            return board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != '';
        }

        const performCheck = () => {
            const temporalTransposedGameBoardMatrix = gameBoardStateMatrix[0].map((col, i) => gameBoardStateMatrix.map(row => row[i]));
            const temporalReversedGameBoardMatrix = [...gameBoardStateMatrix].reverse();
            if (checkRow(temporalTransposedGameBoardMatrix) ||
                checkDiagonal(gameBoardStateMatrix) ||
                checkDiagonal(temporalReversedGameBoardMatrix) ||
                checkRow(gameBoardStateMatrix)) {
                return true;
            }
        }
        if (performCheck()) {
            document.querySelector('.controls>p').textContent = `You won ${gameController.getActivePlayer().getPlayerName()}!`;
            return true;
        }

        // for (let i = 0; i < gameBoardStateMatrix.length; i++) {
        //     let game = gameBoardStateMatrix;
        //     let winner = gameController.getActivePlayer().getPlayerName();
        //     if (game[i][0] == game[i][1] && game[i][0] == game[i][2] && game[i][0] != '') {
        //         result = true;
        //     }
        //     if (game[0][i] == game[1][i] && game[0][i] == game[2][i] && game[0][i] != '') {
        //         result = true;
        //     }
        //     if (game[0][0] == game[1][1] && game[0][0] == game[2][2] && game[0][0] != '') {
        //         result = true;
        //     }
        //     if (game[2][0] == game[1][1] && game[2][0] == game[0][2] && game[2][0] != '') {
        //         result = true;
        //     }
        //     if (result == true) {
        //         document.querySelector('.controls>p').textContent = `You won ${winner}!`;
        //     }
        // }
        // return result;

    }
    const checkTie = () => {
        if (!gameBoard.getGameBoardState().includes('')) {
            document.querySelector('.controls>p').textContent = `It's a tie!`
            return true;
        }
    }
    const restartGame = (() => {
        const restartButton = document.querySelector('button');
        restartButton.addEventListener('click', () => {
            gameBoard.setGameBoardState();
            displayController.displayBoardState(gameBoard.getGameBoardState());
            computer.setActivePlayer(false);
            patryk.setActivePlayer(true);
        })
    })();
    return { checkWinCondition, getActivePlayer, checkTie };
})()

const Player = (name) => {
    let playerSign = '';
    let activePlayer = '';
    const setPlayerSign = (sign) => {
        playerSign = sign;
    }
    const getPlayerSign = () => {
        return playerSign;
    }
    const setActivePlayer = (value) => {
        activePlayer = value;
    };
    const getActivePlayer = () => {
        return activePlayer;
    };
    const getPlayerName = () => {
        return name;
    }
    return { getPlayerSign, setPlayerSign, setActivePlayer, getActivePlayer, getPlayerName };
}

const patryk = Player('Patryk');
const computer = Player('Morpheus');
patryk.setPlayerSign('X');
computer.setPlayerSign('O');
patryk.setActivePlayer(true);
computer.setActivePlayer(false);