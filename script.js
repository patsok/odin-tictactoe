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
                const restartButtons = document.querySelectorAll('.controls button');
                if (restartButtons[1].classList.contains('hidden')) {
                    makeMove(i, field)
                }
            })
        });
    })()
    const getActivePlayer = () => {
        if (player1.getActivePlayer() == true) {
            activePlayer = player1;
        } else {
            activePlayer = player2;
        }
        return activePlayer;
    };
    const changeActivePlayer = () => {
        if (player1.getActivePlayer() == true) {
            player2.setActivePlayer(true);
            player1.setActivePlayer(false);
        } else {
            player2.setActivePlayer(false);
            player1.setActivePlayer(true);
        }
        const restartButtons = document.querySelectorAll('.controls button');
        if (restartButtons[1].classList.contains('hidden')) {
            document.querySelector('.controls>p').textContent = `Your turn ${getActivePlayer().getPlayerName()}`;
        }
    }
    const makeMove = (i, field) => {
        document.querySelector('.controls>p').textContent = '';
        if (gameBoard.getGameBoardState()[i] == '') {
            gameBoard.getGameBoardState()[i] = field.classList.add(`user-${getActivePlayer().getPlayerSign()}`);
            gameBoard.getGameBoardState()[i] = getActivePlayer().getPlayerSign();
            displayController.displayBoardState(gameBoard.getGameBoardState());
            if (gameController.checkWinCondition()) {
                gameBoard.setGameBoardState();
                const restartButtons = document.querySelectorAll('.controls button');
                restartButtons[0].classList.toggle('hidden');
                restartButtons[1].classList.toggle('hidden');
                if (player1.getActivePlayer()) {
                    let win = player1.addWin();
                    const playersResults = document.querySelectorAll('.player-container p:nth-child(2n)');
                    playersResults[0].textContent = win;
                } else {
                    let win = player2.addWin();
                    const playersResults = document.querySelectorAll('.player-container p:nth-child(2n)');
                    playersResults[1].textContent = win;
                }
            }
            if (gameController.checkTie()) {
                gameBoard.setGameBoardState();
                const restartButtons = document.querySelectorAll('.controls button');
                restartButtons[0].classList.toggle('hidden');
                restartButtons[1].classList.toggle('hidden');
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
        const restartButton = document.querySelectorAll('.controls button');
        restartButton[0].addEventListener('click', () => {
            gameBoard.setGameBoardState();
            displayController.displayBoardState(gameBoard.getGameBoardState());
            player2.setActivePlayer(false);
            player1.setActivePlayer(true);
            document.querySelector('.controls>p').textContent = ``;
            const singleField = document.querySelectorAll('.single-field')
            singleField.forEach(field => {
                field.classList.remove(`user-O`);
                field.classList.remove(`user-X`);
                field.classList.remove(`win`);
            });
        })
    })();
    const playNextGame = (() => {
        const restartButton = document.querySelectorAll('.controls button');
        restartButton[1].addEventListener('click', () => {
            gameBoard.setGameBoardState();
            displayController.displayBoardState(gameBoard.getGameBoardState());
            document.querySelector('.controls>p').textContent = ``;
            const singleField = document.querySelectorAll('.single-field')
            singleField.forEach(field => {
                field.classList.remove(`user-O`);
                field.classList.remove(`user-X`);
                field.classList.remove(`win`);
            });
            restartButton[0].classList.toggle('hidden');
            restartButton[1].classList.toggle('hidden');
            document.querySelector('.controls>p').textContent = `Your turn ${getActivePlayer().getPlayerName()}`

        })
    })();
    return { checkWinCondition, getActivePlayer, checkTie, restartGame };
})()

const Player = (name) => {
    let playerSign = '';
    let activePlayer = '';
    let wins = 0;
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
    const setPlayerName = (num) => {
        const inputs = document.querySelectorAll('input');
        name = inputs[num].value;
    };
    const getPlayerName = () => {
        return name;
    };
    const addWin = () => {
        wins++;
        return wins;
    }
    const setWins = () => {
        wins = 0;
    }
    return { getPlayerSign, setPlayerSign, setActivePlayer, getActivePlayer, getPlayerName, setPlayerName, addWin, setWins };
}

// const patryk = Player('Patryk');
// const computer = Player('Morpheus');
// patryk.setPlayerSign('X');
// computer.setPlayerSign('O');
// patryk.setActivePlayer(true);
// computer.setActivePlayer(false);

const player1 = Player('Temp1');
const player2 = Player('Temp2');

const gameStartInterface = (function() {
    const toggleGameVisibility = () => {
        document.querySelector('.game-container').classList.remove('hidden');
    }
    const toggleFormVisibility = () => {
        document.querySelector('form').classList.toggle('hidden');
    }
    const startPlayersGame = () => {
        toggleFormVisibility();
    }
    const startAIGame = () => {

    }
    const startGame = (e) => {
        if (form.checkValidity() == true) {
            e.preventDefault();
            toggleGameVisibility();
            toggleFormVisibility();
            setPlayers();
            player1.setWins();
            player2.setWins();
            const playersResults = document.querySelectorAll('.player-container p:nth-child(2n)');
            playersResults[0].textContent = 0;
            playersResults[1].textContent = 0;
            const restartButton = document.querySelectorAll('.controls button');
            restartButton[0].classList.remove('hidden');
            restartButton[1].classList.add('hidden');
            // gameController.restartGame();
        }
    }
    const startButton = document.querySelectorAll('.header button')
    startButton[0].addEventListener('click', startAIGame);
    startButton[1].addEventListener('click', startPlayersGame);
    const form = document.querySelector('form');
    form.addEventListener('submit', e => startGame(e));

    const setPlayers = () => {
        const playersNames = document.querySelectorAll('.player-container p');
        player1.setPlayerName(0);
        player2.setPlayerName(1);
        player1.setPlayerSign('X');
        player2.setPlayerSign('O');
        player1.setActivePlayer(true);
        player2.setActivePlayer(false);
        playersNames[0].textContent = player1.getPlayerName();
        playersNames[2].textContent = player2.getPlayerName();
        document.querySelector('.controls>p').textContent = `Your turn ${gameController.getActivePlayer().getPlayerName()}`

    }
})()