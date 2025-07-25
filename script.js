const calculatorDisplay = document.querySelector('h1');
const inputButtons = document.querySelectorAll('button');
const clearButton = document.getElementById('clear-button');
const deleteButton = document.getElementById('delete-button');

let firstValue = '';
let operatorValue = '';
let awaitingNextValue = false;

function sendNumberValue(number) {
    if (calculatorDisplay.textContent === 'Error' || calculatorDisplay.textContent === 'Infinity') {
        return; // Do nothing, exit the function
    }
    if (awaitingNextValue) {
        calculatorDisplay.textContent += number;
        awaitingNextValue = false;
    } else {
        if (calculatorDisplay.textContent === '0') {
            calculatorDisplay.textContent = number;
        } else {
            calculatorDisplay.textContent += number;
        }
    }
}

function addDecimal() {
    if (calculatorDisplay.textContent === 'Error' || calculatorDisplay.textContent === 'Infinity') {
        return; // Do nothing, exit the function
    }
    // Normalize display before splitting
    const normalized = calculatorDisplay.textContent.replace(/÷/g, '/').replace(/x/g, '*');

    const parts = normalized.split(/[\+\-\*\/]/);
    const currentNumber = parts[parts.length - 1];

    if (!currentNumber.includes('.')) {
        calculatorDisplay.textContent += '.';
    }
}

function useOperator(operator) {
    if (calculatorDisplay.textContent === 'Error' || calculatorDisplay.textContent === 'Infinity') {
        return; // Do nothing, exit the function
    }
    const lastChar = calculatorDisplay.textContent.slice(-1);

    if (['+', '-', '*', '/', 'x', '÷'].includes(lastChar)) {
        calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, -1) + operator;
    } else {
        calculatorDisplay.textContent += operator;
    }

    awaitingNextValue = true;
    operatorValue = operator;
}



function calculate() {
    if (calculatorDisplay.textContent === 'Error' || calculatorDisplay.textContent === 'Infinity') {
        return; // Do nothing, exit the function
    }

    let expression = calculatorDisplay.textContent;
    expression = expression.replace(/x/g, '*').replace(/÷/g, '/');
    try {
        let result = Function(`"use strict"; return (${expression})`)();

        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(6));
        }

        calculatorDisplay.textContent = result;
        firstValue = '';
        operatorValue = '';
        awaitingNextValue = false;
    } catch {
        calculatorDisplay.textContent = 'Error';
    }
}

function deleteLastChar(){
    // Check if display shows Error or Infinity
    if (calculatorDisplay.textContent === 'Error' || calculatorDisplay.textContent === 'Infinity') {
        return; // Do nothing, exit the function
    }
    
    calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, -1);
    if(calculatorDisplay.textContent === ''){
        calculatorDisplay.textContent = '0';
    }
}

function resetAll() {
    calculatorDisplay.textContent = '0';
    firstValue = '';
    operatorValue = '';
    awaitingNextValue = false;
}

// Attach listeners
inputButtons.forEach((inputButton) => {
    if (inputButton.classList.contains('operator') && !inputButton.classList.contains('equal-sign')) {
        inputButton.addEventListener('click', () => useOperator(inputButton.value));
    } else if (inputButton.classList.contains('decimal')) {
        inputButton.addEventListener('click', addDecimal);
    } else if (inputButton.classList.contains('clear')) {
        inputButton.addEventListener('click', resetAll);
    } else if (inputButton.classList.contains('equal-sign')) {
        inputButton.addEventListener('click', calculate);
    } else if (inputButton.classList.contains('delete')) {
        inputButton.addEventListener('click', deleteLastChar);
    } else {
        inputButton.addEventListener('click', () => sendNumberValue(inputButton.value));
    }
});
