const boardElement = document.getElementById('game-board');
const messageElement = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const pvpBtn = document.getElementById('pvp-btn');
const aiBtn = document.getElementById('ai-btn');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let vsAI = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]           // diags
];

function renderBoard() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach((cellDiv, idx) => {
        cellDiv.textContent = board[idx] ? board[idx] : '';
        cellDiv.classList.remove('win');
    });
}

function handleCellClick(e) {
    const idx = +e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    makeMove(idx, currentPlayer);
    if (vsAI && gameActive && currentPlayer === 'O') {
        aiMove();
    }
}

function makeMove(idx, player) {
    if (!gameActive || board[idx]) return;
    board[idx] = player;
    renderBoard();
    const winLine = getWinLine(player);
    if (winLine) {
        highlightWin(winLine);
        messageElement.textContent = `Player ${player} wins!`;
        gameActive = false;
    } else if (board.every(cell => cell)) {
        messageElement.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageElement.textContent = vsAI && currentPlayer === 'O' ? "AI's turn (O)" : `Player ${currentPlayer}'s turn`;
    }
}

function getWinLine(player) {
    for (const pattern of winPatterns) {
        if (pattern.every(idx => board[idx] === player)) {
            return pattern;
        }
    }
    return null;
}

function highlightWin(indices) {
    const cells = boardElement.querySelectorAll('.cell');
    indices.forEach(idx => {
        cells[idx].classList.add('win');
    });
}

function aiMove() {
    if (!gameActive) return;
    const emptyIndices = board.map((cell, idx) => cell ? null : idx).filter(idx => idx !== null);
    if (emptyIndices.length === 0) return;
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(move, 'O');
}

function restartGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    messageElement.textContent = vsAI ? "Player X's turn" : "Player X's turn";
    renderBoard();
}

pvpBtn.addEventListener('click', () => {
    vsAI = false;
    restartGame();
    messageElement.textContent = "Player X's turn (PvP)";
});
aiBtn.addEventListener('click', () => {
    vsAI = true;
    restartGame();
    messageElement.textContent = "Player X's turn (vs AI)";
});
restartBtn.addEventListener('click', restartGame);

// Update event listeners for static cells
function setupCellListeners() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cellDiv => {
        cellDiv.removeEventListener('click', handleCellClick); // Prevent duplicate
        cellDiv.addEventListener('click', handleCellClick);
    });
}

// Call setupCellListeners once on load
setupCellListeners();

// Initial render
renderBoard();
messageElement.textContent = "Choose a mode to start!"; 