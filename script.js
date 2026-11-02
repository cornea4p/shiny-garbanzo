let display = document.getElementById('display');
let currentValue = '0';
let expression = '';

function updateDisplay() {
  display.textContent = currentValue;
}

function isOperator(value) {
  return ['+', '-', '*', '/'].includes(value);
}

function appendValue(value) {
  if (value === '.' && currentValue.includes('.')) {
    return;
  }

  if (currentValue === '0' && value !== '.') {
    currentValue = value;
  } else {
    currentValue += value;
  }

  expression += value;
  updateDisplay();
}

function handleOperator(operator) {
  if (expression === '') {
    return;
  }

  const lastChar = expression.slice(-1);

  if (isOperator(lastChar)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  currentValue = operator;
  updateDisplay();
}

function clearAll() {
  currentValue = '0';
  expression = '';
  updateDisplay();
}

function deleteLast() {
  if (expression === '') {
    return;
  }

  expression = expression.slice(0, -1);

  if (expression === '') {
    currentValue = '0';
  } else {
    const lastNumber = expression.split(/[+\-*/]/).pop();
    currentValue = lastNumber !== undefined ? lastNumber : '0';
  }

  updateDisplay();
}

function calculate() {
  if (!expression || isOperator(expression.slice(-1))) {
    return;
  }

  const sanitizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

  try {
    const result = Function(`"use strict"; return (${sanitizedExpression});`)();
    currentValue = Number.isFinite(result) ? String(result) : 'Error';
    expression = Number.isFinite(result) ? String(result) : '';
  } catch {
    currentValue = 'Error';
    expression = '';
  }

  updateDisplay();
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'equals') {
      calculate();
      return;
    }

    if (value && isOperator(value)) {
      handleOperator(value);
      return;
    }

    if (value) {
      appendValue(value);
    }
  });
});

updateDisplay();
