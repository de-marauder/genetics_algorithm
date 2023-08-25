"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToFileInTableFormat = exports.createFileIfNotExists = exports.defaultNewIndividualTraits = exports.getRandomNumberInRange = exports.roundToNearestInteger = void 0;
const fs_1 = __importDefault(require("fs"));
function roundToNearestInteger(number) {
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    if (decimalPart < 0.4) {
        return integerPart;
    }
    else {
        return integerPart + 1;
    }
}
exports.roundToNearestInteger = roundToNearestInteger;
function getRandomNumberInRange(min, max) {
    return +(Math.random() * (max - min) + min).toFixed(4);
}
exports.getRandomNumberInRange = getRandomNumberInRange;
exports.defaultNewIndividualTraits = {
    pressure: 0,
    temperature: 0,
    steamCarbonRatio: 0
};
// Function to create a file if it doesn't exist
function createFileIfNotExists(fileName) {
    if (!fs_1.default.existsSync(fileName)) {
        fs_1.default.writeFileSync(fileName, '', { flag: 'w' });
    }
}
exports.createFileIfNotExists = createFileIfNotExists;
// Function to write a line in a columnated format to a file
function writeToFileInTableFormat(fileName, data) {
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
            const str = column.padEnd(roundToNearestInteger(maxLine / row.length) + 4, ' ');
            return `| ${str} |`;
        })
            .join('');
    })
        .join('\n');
    fs_1.default.writeFileSync(fileName, alignedTableString);
}
exports.writeToFileInTableFormat = writeToFileInTableFormat;
