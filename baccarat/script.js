document.getElementById('betPlayer').addEventListener('click', () => placeBet('player'));
document.getElementById('betBanker').addEventListener('click', () => placeBet('banker'));
document.getElementById('betTie').addEventListener('click', () => placeBet('tie'));
document.getElementById('dealCards').addEventListener('click', dealCards);

let playerBet = '';
let playerHand = [];
let bankerHand = [];
let balance = 100; // Initial balance for the player
let betAmount = 0; // Total bet amount
let totalBetElement = document.getElementById('totalBet');
let playerHandElement = document.getElementById('playerHand');
let bankerHandElement = document.getElementById('bankerHand');
let resultElement = document.getElementById('result');
let balanceElement = document.getElementById('balance');
let playerCardsDisplay = document.getElementById('playerCards');
let bankerCardsDisplay = document.getElementById('bankerCards');

const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
    chip.addEventListener('click', () => addChipToBet(parseInt(chip.dataset.value)));
});

function addChipToBet(chipValue) {
    betAmount += chipValue;
    totalBetElement.textContent = betAmount;
}

function placeBet(bet) {
    if (betAmount === 0) {
        alert("Please place a bet first by selecting chips.");
        return;
    }

    playerBet = bet;
    resultElement.textContent = `You bet $${betAmount} on ${bet.toUpperCase()}!`;
    document.getElementById('dealCards').disabled = false;
}

function dealCards() {
    playerHand = drawCards();
    bankerHand = drawCards();

    displayHands();

    const winner = determineWinner();
    updateResult(winner);

    resetGame();
}

function drawCards() {
    const cards = [];
    while (cards.length < 2) {
        const card = Math.floor(Math.random() * 10) + 1; // Cards valued between 1 and 10
        cards.push(card);
    }
    return cards;
}

function calculateHandTotal(hand) {
    let total = hand.reduce((acc, card) => acc + card, 0);
    // In Baccarat, only the last digit of the total matters
    return total % 10;
}

function displayHands() {
    playerCardsDisplay.innerHTML = '';
    bankerCardsDisplay.innerHTML = '';

    playerHand.forEach(card => {
        playerCardsDisplay.appendChild(createCardElement(card));
    });
    bankerHand.forEach(card => {
        bankerCardsDisplay.appendChild(createCardElement(card));
    });

    const playerTotal = calculateHandTotal(playerHand);
    const bankerTotal = calculateHandTotal(bankerHand);

    playerHandElement.textContent = `Player Hand: ${playerTotal}`;
    bankerHandElement.textContent = `Banker Hand: ${bankerTotal}`;
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    cardElement.textContent = card; // Display card value
    
    return cardElement;
}

function determineWinner() {
    const playerTotal = calculateHandTotal(playerHand);
    const bankerTotal = calculateHandTotal(bankerHand);

    if (playerTotal > bankerTotal) {
        return 'player';
    } else if (bankerTotal > playerTotal) {
        return 'banker';
    } else {
        return 'tie';
    }
}

function updateResult(winner) {
    if (playerBet === winner) {
        resultElement.textContent = `You win! ${winner.toUpperCase()} wins.`;
        balance += betAmount;
    } else {
        resultElement.textContent = `You lose. ${winner.toUpperCase()} wins.`;
        balance -= betAmount;
    }
    updateBalance();
}

function updateBalance() {
    balanceElement.textContent = `Balance: $${balance}`;
}

function resetGame() {
    playerBet = '';
    betAmount = 0;
    totalBetElement.textContent = betAmount;
    document.getElementById('dealCards').disabled = true; // Disable the "Deal Cards" button until a new bet is placed

    if (balance <= 0) {
        alert("Game over! You're out of money.");
        resultElement.textContent = "Game Over!";
        document.getElementById('betPlayer').disabled = true;
        document.getElementById('betBanker').disabled = true;
        document.getElementById('betTie').disabled = true;
    }
}
