import fs from 'fs';
export function roundToNearestInteger(number: number): number {
	const integerPart = Math.floor(number);
	const decimalPart = number - integerPart;

	if (decimalPart < 0.4) {
		return integerPart;
	} else {
		return integerPart + 1;
	}
}

export function getRandomNumberInRange(min: number, max: number): number {
	return +(Math.random() * (max - min) + min).toFixed(4);
}

export const defaultNewIndividualTraits = {
	pressure: 0,
	temperature: 0,
	steamCarbonRatio: 0
};

// Function to create a file if it doesn't exist
export function createFileIfNotExists(fileName: string): void {
	if (!fs.existsSync(fileName)) {
		fs.writeFileSync(fileName, '', { flag: 'w' });
	}
}

// Function to write a line in a columnated format to a file
export function writeToFileInTableFormat(
	fileName: string,
	data: string[][]
): void {
	const tableString = data.map(row => row.join('\t')).join('\n');

	let maxLine = 0;

	data.forEach(row => {
		const s = row.join(' ');
		if (s.length > maxLine) {
			maxLine = s.length;
		}
	});

	const alignedTableString = tableString
		.split('\n')
		.map(row => row.split('\t'))
		.map((row, index) => {
			return row
				.map(column => {
					const str = column.padEnd(
						roundToNearestInteger(maxLine / row.length) + 4,
						' '
					);
					return `| ${str} |`;
				})
				.join('');
		})
		.join('\n');

	fs.writeFileSync(fileName, alignedTableString);
}
