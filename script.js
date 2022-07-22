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

    // restart board to untouched version
    const restartGameBoardStateDisplay = () => {
        setGameBoardState();
        displayController.displayBoardState(gameBoard.getGameBoardState());
        document.querySelectorAll('.single-field').forEach(field => {
            field.classList.remove(`user-O`, `user-X`, `win`);
        });
    }
    return { getGameBoardState, setGameBoardState, restartGameBoardStateDisplay };
})()

const gameController = (function() {
    const singleField = document.querySelectorAll('.single-field');
    const restartButton = document.querySelector('.controls button:first-child');
    const playAgainButton = document.querySelector('.controls button:nth-child(2)');

    //get user click to make move
    const getUserChoice = (() => {
        singleField.forEach((field, i) => {
            field.addEventListener('click', () => {
                if (playAgainButton.classList.contains('hidden')) {
                    let check = makePlayerMove(i, field);
                    if (getActivePlayer().getPlayerName() == 'Computer' && !check) {
                        toggleClickableFields() //unclickable
                        setTimeout(makeComputerMove, 500);
                    }
                }
            })
        });
    })()

    const getActivePlayer = () => {
        player1.getActivePlayer() ? activePlayer = player1 : activePlayer = player2;
        return activePlayer;
    };

    //change active player with switching text
    const changeActivePlayer = () => {
        if (player1.getActivePlayer()) {
            player2.setActivePlayer(true);
            player1.setActivePlayer(false);
        } else {
            player2.setActivePlayer(false);
            player1.setActivePlayer(true);
        }
        if (playAgainButton.classList.contains('hidden')) {
            if (getActivePlayer().getPlayerName() == 'Computer') {
                changeTextState(`Computer's turn`);
            } else {
                changeTextState(`Your turn ${getActivePlayer().getPlayerName()}`);
            }
        }
    }

    const makePlayerMove = (i, field) => {
        makeMove(i, field);
    }

    //main function to make moves and invoking win/tie checks
    const makeMove = (i, field) => {
        changeTextState(); // default text state
        let activePlayerSign = getActivePlayer().getPlayerSign();
        if (gameBoard.getGameBoardState()[i] == '') {
            field.classList.add(`user-${activePlayerSign}`); //change text sign to visual sign
            gameBoard.getGameBoardState()[i] = activePlayerSign; //make move
            displayController.displayBoardState(gameBoard.getGameBoardState());
            if (checkWinCondition(gameBoard.getGameBoardState(), activePlayerSign)) {
                const playersResults = document.querySelectorAll('.player-container p:nth-child(2n)');
                player1.getActivePlayer() ? playersResults[0].textContent = player1.addWin() : playersResults[1].textContent = player2.addWin(); //add wins
                gameBoard.setGameBoardState(); // default gameboard
                toggleControlButtons(); // +playagain -restart
                return true;
            }
            if (checkTie()) {
                gameBoard.setGameBoardState(); // default gameboard
                toggleControlButtons(); // +playagain -restart
                return true;
            }
            changeActivePlayer();
        }
    }

    const makeComputerMove = () => {
        const difficulty = gameSetUp.getDifficulty();
        let move;
        if (difficulty == 'easy') {
            //make random move
            const indexedEmptyBoard = gameBoard.getGameBoardState().map((empty, index) => {
                return empty == '' ? index : false;
            }).filter(empty => typeof empty == "number");
            move = indexedEmptyBoard[Math.floor(Math.random() * indexedEmptyBoard.length)];
        } else {
            //use minimax algorithm
            move = algorithmAI.minimax(gameBoard.getGameBoardState(), 'O', difficulty).index;
        }
        makeMove(move, singleField[move]);
        toggleClickableFields(); //clickable
    }

    const checkWinCondition = (board, player) => {
        //change 1dim board to 2dim
        let gameBoardStateMatrix = board.reduce((acc, c, i) => {
            if (!(i % 3))
                acc.push(board.slice(i, i + 3));
            return acc;
        }, []);

        const checkRow = (board, pos, player) => {
            for (let i = 0; i < 3; i++) {
                if (checkSingleRow(board[i], i, pos, player)) {
                    return true;
                }
            }
        }

        const checkSingleRow = (row, i, pos, player) => {
            if (row[0] == row[1] && row[0] == row[2] && row[0] != '' && row[0] == player) {
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
        const checkDiagonal = (board, pos, player) => {
                if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != '' && board[0][0] == player) {
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
            //if one of the checks return true -> perfrom check is true
        const performCheck = (player) => {
            const temporalTransposedGameBoardMatrix = gameBoardStateMatrix[0].map((col, i) => gameBoardStateMatrix.map(row => row[i])); //transposed matrix
            const temporalReversedGameBoardMatrix = [...gameBoardStateMatrix].reverse(); //reversed matrix
            if (checkRow(temporalTransposedGameBoardMatrix, "cols", player) ||
                checkDiagonal(gameBoardStateMatrix, "mainDiagonal", player) ||
                checkDiagonal(temporalReversedGameBoardMatrix, "secondaryDiagonal", player) ||
                checkRow(gameBoardStateMatrix, "rows", player)) {
                return true;
            }
        }
        if (performCheck(player)) {
            getActivePlayer().getPlayerName() == "Computer" ? changeTextState(`Computer won!`) :
                changeTextState(`You won ${getActivePlayer().getPlayerName()}!`);
            return true;
        }
    }

    const checkTie = () => {
        if (!gameBoard.getGameBoardState().includes('')) {
            changeTextState(`It's a tie!`);
            return true;
        }
    }
    const restartGame = () => {
        gameBoard.restartGameBoardStateDisplay();
        firstComputerMove();
    };

    const playNextGame = () => {
        changeTextState();
        gameBoard.restartGameBoardStateDisplay();
        toggleControlButtons();
        changeActivePlayer();
        firstComputerMove();
    };

    //if computer starts game then pick random move -> corner or middle (rest are not-optimal)
    const firstComputerMove = () => {
        if (getActivePlayer().getPlayerName() == 'Computer') {
            toggleClickableFields(); //unclickable
            changeTextState(`Computer's turn`);
            const index = [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
            setTimeout(() => toggleClickableFields(), makeMove(index, singleField[index]), 500) // clickable
        } else {
            changeTextState(`Your turn ${getActivePlayer().getPlayerName()}`);
        }
    }

    //toggle user possibility to click fields
    const toggleClickableFields = () => {
        singleField.forEach(field => {
            field.classList.toggle('no-click');
        })
    }
    const changeTextState = (value) => {
        typeof value == "undefined" ? document.querySelector('.controls>p').textContent = `` : document.querySelector('.controls>p').textContent = `${value}`;
    }

    const toggleControlButtons = () => {
        restartButton.classList.toggle('hidden');
        playAgainButton.classList.toggle('hidden');
    }

    return { getActivePlayer, restartGame, playNextGame };
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

const gameSetUp = (function() {
    const startButton = document.querySelectorAll('.header button')
    const form = document.querySelector('form');
    const labels = document.querySelectorAll('label');
    const inputFields = document.querySelectorAll('.input-field');
    const inputs = document.querySelectorAll('.input-field input');
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
    const setPlayersGame = () => {
        showElement('form');
        showElement(labels[0]);
        hideElement(labels[1]);
        showElement(inputFields[1]);
        hideElement(inputFields[2]);
        showElement(inputFields[3]);
        inputs[0].value = '';
        inputs[1].value = '';
        inputs[1].disabled = false;
    }
    const setAIGame = () => {
        showElement('form');
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

    //set up event listeners
    startButton[0].addEventListener('click', setAIGame);
    startButton[1].addEventListener('click', setPlayersGame);
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
    const setGameQueries = (() => {
        document.querySelector('.controls button:first-child').addEventListener('click', gameController.restartGame);
        document.querySelector('.controls button:nth-child(2)').addEventListener('click', gameController.playNextGame);
    })();


    return { getDifficulty };
})()

let algorithmAI = (function() {
    let minimax = (newBoard, player, difficulty) => {
        newBoard = [...newBoard];

        //convert values of available spots to empty values for win check
        newBoard = newBoard.map((empty) => {
            return typeof empty == "number" ? '' : empty;
        });

        //create array with current available spots
        var availSpots = newBoard.map((empty, index) => {
            return empty == '' ? index : false;
        }).filter(empty => typeof empty == "number");
        //set scores if end of board
        if (checkWinConditionMinimax(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWinConditionMinimax(newBoard, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        //convert values of available spots to index values for recursive
        newBoard = newBoard.map((empty, index) => {
            return empty == '' ? index : empty;
        })

        //create array with all possible moves populated by objects {index,score}
        var moves = [];
        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;
            if (player == 'O') {
                var result = minimax(newBoard, 'X', difficulty);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, 'O', difficulty);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;
            moves.push(move);
        }

        //choose best move by score from all available moves
        var bestMove;
        if (difficulty == 'impossible') {
            if (player === 'O') {
                var bestScore = -10000;
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                var bestScore = 10000;
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
        }

        // choose best move by score if there are less than 5 moves
        // above that it pick random from 2 best possible moves
        if (difficulty == 'hard') {
            if (availSpots.length <= 3) {
                moves = moves.sort((a, b) => (b.score - a.score)).slice(0, Math.ceil(moves.length / 2));
                bestMove = Math.floor(Math.random() * moves.length);
            } else {
                if (player === 'O') {
                    var bestScore = -10000;
                    for (var i = 0; i < moves.length; i++) {
                        if (moves[i].score > bestScore) {
                            bestScore = moves[i].score;
                            bestMove = i;
                        }
                    }
                } else {
                    var bestScore = 10000;
                    for (var i = 0; i < moves.length; i++) {
                        if (moves[i].score < bestScore) {
                            bestScore = moves[i].score;
                            bestMove = i;
                        }
                    }
                }
            }
        }
        return moves[bestMove];
    }

    let checkWinConditionMinimax = (board, player) => {
        let gameBoardStateMatrix = board.reduce((acc, c, i) => {
            if (!(i % 3))
                acc.push(board.slice(i, i + 3));
            return acc;
        }, []);
        const checkRow = (board, player) => {
            for (let i = 0; i < 3; i++) {
                if (checkSingleRow(board[i], player)) {
                    return true;
                }
            }
        }
        const checkSingleRow = (row, player) => {
            return row[0] == row[1] && row[0] == row[2] && row[0] != '' && row[0] == player
        }
        const checkDiagonal = (board, player) => {
            return board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != '' && board[0][0] == player
        }

        const performCheck = (player) => {
            const temporalTransposedGameBoardMatrix = gameBoardStateMatrix[0].map((col, i) => gameBoardStateMatrix.map(row => row[i]));
            const temporalReversedGameBoardMatrix = [...gameBoardStateMatrix].reverse();
            return checkRow(temporalTransposedGameBoardMatrix, player) ||
                checkDiagonal(gameBoardStateMatrix, player) ||
                checkDiagonal(temporalReversedGameBoardMatrix, player) ||
                checkRow(gameBoardStateMatrix, player)
        }
        if (performCheck(player)) {
            return true;
        }
    }
    return { minimax };
})()