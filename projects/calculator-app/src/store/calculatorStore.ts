import { create } from 'zustand';

interface CalculatorState {
  display: string;
  previousValue: string;
  operation: string | null;
  history: string[];
  mode: 'basic' | 'scientific';

  // Actions
  inputNumber: (num: string) => void;
  inputDecimal: () => void;
  inputOperation: (op: string) => void;
  calculate: () => void;
  clear: () => void;
  clearEntry: () => void;
  backspace: () => void;
  toggleSign: () => void;
  percentage: () => void;
  scientificOperation: (op: string) => void;
  setMode: (mode: 'basic' | 'scientific') => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  display: '0',
  previousValue: '',
  operation: null,
  history: [],
  mode: 'basic',

  inputNumber: (num: string) => {
    const { display } = get();
    if (display === '0') {
      set({ display: num });
    } else {
      set({ display: display + num });
    }
  },

  inputDecimal: () => {
    const { display } = get();
    if (!display.includes('.')) {
      set({ display: display + '.' });
    }
  },

  inputOperation: (op: string) => {
    const { display, previousValue, operation } = get();

    if (operation && previousValue) {
      get().calculate();
    }

    set({
      operation: op,
      previousValue: display,
      display: '0',
    });
  },

  calculate: () => {
    const { display, previousValue, operation, history } = get();

    if (!operation || !previousValue) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current !== 0 ? prev / current : 0;
        break;
      case '^':
        result = Math.pow(prev, current);
        break;
      default:
        return;
    }

    const calculation = `${previousValue} ${operation} ${display} = ${result}`;
    const newHistory = [calculation, ...history].slice(0, 20);

    set({
      display: result.toString(),
      previousValue: '',
      operation: null,
      history: newHistory,
    });
  },

  clear: () => {
    set({
      display: '0',
      previousValue: '',
      operation: null,
    });
  },

  clearEntry: () => {
    set({ display: '0' });
  },

  backspace: () => {
    const { display } = get();
    if (display.length > 1) {
      set({ display: display.slice(0, -1) });
    } else {
      set({ display: '0' });
    }
  },

  toggleSign: () => {
    const { display } = get();
    const num = parseFloat(display);
    set({ display: (-num).toString() });
  },

  percentage: () => {
    const { display } = get();
    const num = parseFloat(display);
    set({ display: (num / 100).toString() });
  },

  scientificOperation: (op: string) => {
    const { display, history } = get();
    const num = parseFloat(display);
    let result = 0;

    switch (op) {
      case 'sin':
        result = Math.sin(num * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(num * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(num * Math.PI / 180);
        break;
      case 'ln':
        result = Math.log(num);
        break;
      case 'log':
        result = Math.log10(num);
        break;
      case '√':
        result = Math.sqrt(num);
        break;
      case 'x²':
        result = num * num;
        break;
      case '1/x':
        result = num !== 0 ? 1 / num : 0;
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    const calculation = `${op}(${display}) = ${result}`;
    const newHistory = [calculation, ...history].slice(0, 20);

    set({
      display: result.toString(),
      history: newHistory,
    });
  },

  setMode: (mode: 'basic' | 'scientific') => {
    set({ mode });
  },
}));
