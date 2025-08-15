type Operation = 'multiply' | 'add' | 'divide' | 'subtract';

function calculate(a: number, b: number, op: Operation): number {
	switch (op) {
		case 'add':
			return a + b;
		case 'subtract':
			return a - b;
		case 'multiply':
			return a * b;
		case 'divide':
			return a / b;
	}
}

export default calculate;
export type { Operation };
