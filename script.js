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
            field.addEventListener('click', () => {
                if (document.querySelector('.controls>p').textContent == ``) {
                    makeMove(i, field)
                }
            })
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
    const makeMove = (i, field) => {
        document.querySelector('.controls>p').textContent = '';
        if (gameBoard.getGameBoardState()[i] == '') {
            gameBoard.getGameBoardState()[i] = field.classList.add(`user-${getActivePlayer().getPlayerSign()}`);
            gameBoard.getGameBoardState()[i] = getActivePlayer().getPlayerSign();
            displayController.displayBoardState(gameBoard.getGameBoardState());
            if (gameController.checkWinCondition() || gameController.checkTie()) {
                gameBoard.setGameBoardState();
            }
            changeActivePlayer();
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

        const checkRow = (board, pos) => {
            for (let i = 0; i < 3; i++) {
                if (checkSingleRow(board[i], i, pos)) {
                    return true;
                }
            }
        }

        const checkSingleRow = (row, i, pos) => {
            if (row[0] == row[1] && row[0] == row[2] && row[0] != '') {
                let winningFields;
                if (pos == "rows") {
                    winningFields = document.querySelectorAll(`.single-field.row${i+1}`);
                }
                if (pos == "cols") {
                    winningFields = document.querySelectorAll(`.single-field.col${i+1}`);
                }
                winningFields.forEach(field => {
                    field.classList.add(`win`)
                });
                return true;
            }
        }
        const checkDiagonal = (board, pos) => {
            if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != '') {
                if (pos == "mainDiagonal") {
                    for (let i = 0; i < 3; i++) {
                        document.querySelector(`.single-field.col${i+1}.row${i+1}`).classList.add('win');
                    }
                }
                if (pos == "secondaryDiagonal") {
                    for (let i = 0; i < 3; i++) {
                        document.querySelector(`.single-field.col${3-i}.row${i+1}`).classList.add('win');
                    }
                }
                return true;
            }
        }

        const performCheck = () => {
            const temporalTransposedGameBoardMatrix = gameBoardStateMatrix[0].map((col, i) => gameBoardStateMatrix.map(row => row[i]));
            const temporalReversedGameBoardMatrix = [...gameBoardStateMatrix].reverse();
            if (checkRow(temporalTransposedGameBoardMatrix, "cols") ||
                checkDiagonal(gameBoardStateMatrix, "mainDiagonal") ||
                checkDiagonal(temporalReversedGameBoardMatrix, "secondaryDiagonal") ||
                checkRow(gameBoardStateMatrix, "rows")) {
                return true;
            }
        }
        if (performCheck()) {
            document.querySelector('.controls>p').textContent = `You won ${gameController.getActivePlayer().getPlayerName()}!`;
            return true;
        }
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
            document.querySelector('.controls>p').textContent = ``;
            const singleField = document.querySelectorAll('.single-field')
            singleField.forEach(field => {
                field.classList.remove(`user-O`);
                field.classList.remove(`user-X`);
                field.classList.remove(`win`);
            });
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