document.addEventListener('DOMContentLoaded', () => {
    const balanceInput = document.getElementById('balance');
    const linesInput = document.getElementById('lines');
    const betInput = document.getElementById('bet');
    const spinButton = document.getElementById('spinButton');
    const quitButton = document.getElementById('quitButton');
    const slotMachine = document.getElementById('slot-machine');
    const winningsDisplay = document.getElementById('winnings');
    const remainingBalanceDisplay = document.getElementById('remaining-balance');

    const symbolCount = {
        "A": 2,
        "B": 4,
        "C": 6,
        "D": 8
    };
    const symbolValues = {
        "A": 5,
        "B": 4,
        "C": 3,
        "D": 2
    };

    function renderSlots(slots) {
        slotMachine.innerHTML = '';
        slots.forEach(column => {
            column.forEach(symbol => {
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('slot');
                slotDiv.textContent = symbol;
                slotMachine.appendChild(slotDiv);
            });
        });
    }

    function getSlotMachineSpin(rows, cols, symbols) {
        const allSymbols = [];
        for (const [symbol, count] of Object.entries(symbols)) {
            for (let i = 0; i < count; i++) {
                allSymbols.push(symbol);
            }
        }

        const columns = [];
        for (let i = 0; i < cols; i++) {
            const column = [];
            const currentSymbols = [...allSymbols];
            for (let j = 0; j < rows; j++) {
                const value = currentSymbols.splice(Math.floor(Math.random() * currentSymbols.length), 1)[0];
                column.push(value);
            }
            columns.push(column);
        }
        return columns;
    }

    function checkWinnings(columns, lines, bet, values) {
        let winnings = 0;
        const winningLines = [];
        for (let line = 0; line < lines; line++) {
            const symbol = columns[0][line];
            let isWinningLine = true;
            for (const column of columns) {
                if (column[line] !== symbol) {
                    isWinningLine = false;
                    break;
                }
            }
            if (isWinningLine) {
                winnings += values[symbol] * bet;
                winningLines.push(line + 1);
            }
        }
        return { winnings, winningLines };
    }

    function startSpinningAnimation() {
        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => {
            slot.classList.add('spin-animation');
        });
    }

    function stopSpinningAnimation() {
        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => {
            slot.classList.remove('spin-animation');
        });
    }

    spinButton.addEventListener('click', () => {
        const balance = parseInt(balanceInput.value);
        const lines = parseInt(linesInput.value);
        const bet = parseInt(betInput.value);
        const totalBet = lines * bet;

        if (totalBet > balance) {
            alert('Not enough balance.');
            return;
        }

        startSpinningAnimation();

        setTimeout(() => {
            const slots = getSlotMachineSpin(3, 3, symbolCount);
            const { winnings, winningLines } = checkWinnings(slots, lines, bet, symbolValues);
            const newBalance = balance + winnings - totalBet;
            balanceInput.value = newBalance;

            renderSlots(slots);
            winningsDisplay.textContent = `Winnings: $${winnings}`;
            remainingBalanceDisplay.textContent = `Remaining Balance: $${newBalance}`;

            stopSpinningAnimation();
        }, 2000); // Change the duration according to your preference
    });

    quitButton.addEventListener('click', () => {
        window.close();
    });
});

