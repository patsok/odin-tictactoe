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
        const singleField = document.querySelectorAll('.single-field');
        singleField.forEach((field, i) => {
            field.addEventListener('click', () => {
                const restartButtons = document.querySelectorAll('.controls button');
                if (restartButtons[1].classList.contains('hidden')) {
                    let check = makePlayerMove(i, field);
                    if (getActivePlayer().getPlayerName() == 'Computer' && !check) {
                        singleField.forEach(field => {
                            field.classList.add('no-click');
                        })
                        const timeout = setTimeout(makeComputerMove, 500);
                    }
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
            if (getActivePlayer().getPlayerName() == 'Computer') {
                document.querySelector('.controls>p').textContent = `Computer's turn`;
            } else {
                document.querySelector('.controls>p').textContent = `Your turn ${getActivePlayer().getPlayerName()}`;
            }
        }
    }

    const makePlayerMove = (i, field) => {
        makeMove(i, field);
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
                return true;
            }
            if (gameController.checkTie()) {
                gameBoard.setGameBoardState();
                const restartButtons = document.querySelectorAll('.controls button');
                restartButtons[0].classList.toggle('hidden');
                restartButtons[1].classList.toggle('hidden');
                return true;
            }
            changeActivePlayer();
        }
    }

    const makeComputerMove = () => {
        const difficulty = gameStartInterface.getDifficulty();
        if (difficulty == 'easy') {
            const singleField = document.querySelectorAll('.single-field')
            const indexedEmptyBoard = gameBoard.getGameBoardState().map((empty, index) => {
                if (empty == '') {
                    return index;
                }
                return false;
            }).filter(empty => typeof empty == "number");
            const index = indexedEmptyBoard[Math.floor(Math.random() * indexedEmptyBoard.length)];
            field = singleField[index];
            makeMove(index, field)
        } else if (difficulty == 'hard') {
            console.log('hard')
        } else {
            console.log('impossible')
        }
        const singleField = document.querySelectorAll('.single-field')
        singleField.forEach(field => {
            field.classList.remove('no-click');
        })
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
    const restartGame = () => {
        gameBoard.setGameBoardState();
        displayController.displayBoardState(gameBoard.getGameBoardState());
        if (getActivePlayer().getPlayerName() == 'Computer') {
            document.querySelector('.controls>p').textContent = `Computer's turn`;
        } else {
            document.querySelector('.controls>p').textContent = `Your turn ${getActivePlayer().getPlayerName()}`;
        };
        const singleField = document.querySelectorAll('.single-field');
        singleField.forEach(field => {
            field.classList.remove(`user-O`);
            field.classList.remove(`user-X`);
            field.classList.remove(`win`);
        });
        if (getActivePlayer().getPlayerName() == 'Computer') {
            const timeout = setTimeout(makeComputerMove, 500);
        }
    };
    const restartGameQuery = (() => {
        const restartButton = document.querySelectorAll('.controls button');
        restartButton[0].addEventListener('click', restartGame);
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
            if (getActivePlayer().getPlayerName() == 'Computer') {
                document.querySelector('.controls>p').textContent = `Computer's turn`;
            } else {
                document.querySelector('.controls>p').textContent = `Your turn ${getActivePlayer().getPlayerName()}`;
            }
            changeActivePlayer();
            if (getActivePlayer().getPlayerName() == 'Computer') {
                setTimeout(makeComputerMove, 500);
            }
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

const player1 = Player('Player 1');
const player2 = Player('Computer');

const gameStartInterface = (function() {
    const startButton = document.querySelectorAll('.header button')
    const form = document.querySelector('form');
    let difficulty = '';

    const hideElement = (element) => {
        if (typeof element == "string") {
            document.querySelector(element).classList.add('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
    const showElement = (element) => {
        if (typeof element == "string") {
            document.querySelector(element).classList.remove('hidden');
        } else {
            element.classList.remove('hidden');
        }
    }
    const toggleElement = (element) => {
        if (typeof element == "string") {
            document.querySelector(element).classList.toggle('hidden');
        } else {
            element.classList.toggle('hidden');
        }
    }
    const toggleButtonVisibility = () => {
        let buttons = document.querySelectorAll('.mode-buttons button');
        buttons.forEach(button => {
            toggleElement(button)
        });
    }
    const startPlayersGame = () => {
        showElement('form');
        const labels = document.querySelectorAll('label');
        const inputFields = document.querySelectorAll('.input-field');
        const inputs = document.querySelectorAll('.input-field input');
        showElement(labels[0]);
        hideElement(labels[1]);
        showElement(inputFields[1]);
        hideElement(inputFields[2]);
        showElement(inputFields[3]);
        inputs[0].value = '';
        inputs[1].value = '';
        inputs[1].disabled = false;
    }
    const startAIGame = () => {
        showElement('form');
        const labels = document.querySelectorAll('label');
        const inputFields = document.querySelectorAll('.input-field');
        const inputs = document.querySelectorAll('.input-field input');
        hideElement(labels[0]);
        showElement(labels[1]);
        hideElement(inputFields[1]);
        hideElement(inputFields[3]);
        showElement(inputFields[2]);
        inputs[0].value = '';
        inputs[1].value = 'Computer';
        inputs[1].disabled = true;
    }
    const startGame = (e) => {
        if (form.checkValidity() == true) {
            e.preventDefault();
            toggleElement('.game-container');
            toggleElement('form');
            toggleButtonVisibility();
            setPlayers();
            player1.setWins();
            player2.setWins();
            const playersResults = document.querySelectorAll('.player-container p:nth-child(2n)');
            playersResults[0].textContent = 0;
            playersResults[1].textContent = 0;
            const restartButton = document.querySelectorAll('.controls button');
            showElement(restartButton[0]);
            hideElement(restartButton[1]);
            gameController.restartGame();
        }
    }

    const setInterface = () => {
        hideElement('.game-container');
        toggleButtonVisibility();
        startButton[0].disabled = false;
        startButton[1].disabled = false;
    }

    startButton[0].addEventListener('click', startAIGame);
    startButton[1].addEventListener('click', startPlayersGame);
    startButton[2].addEventListener('click', setInterface);
    form.addEventListener('submit', e => startGame(e));
    form.addEventListener('submit', e => setDifficulty(e));

    const setDifficulty = (e) => {
        difficulty = e.submitter.textContent.toLowerCase();
    }
    const getDifficulty = () => {
        return difficulty;
    }

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

    return { getDifficulty };
})()