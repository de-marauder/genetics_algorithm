'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Configuration = void 0;
class Configuration {}
exports.Configuration = Configuration;
Configuration.individualTraitBoundaries = {
	pressureLowerbound: 20,
	pressureUpperbound: 30,
	temperatureLowerbound: 500,
	temperatureUpperbound: 850,
	steamCarbonRatioLowerbound: 2,
	steamCarbonRatioUpperbound: 10
};
Configuration.algoConfig = {
	popSize: 20,
	genSize: 20,
	movingAverage: 10,
	mutationProbability: 2
};
// On a basis of 100 kmol of natural gas or flare gas
Configuration.gasComposition = {
	CH4: 100
};
