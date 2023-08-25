import { AlgoConfig, Compositions, Config, IndividualConfig } from './types';

export class Configuration {
	static individualTraitBoundaries: IndividualConfig = {
		pressureLowerbound: 20, // unit = bars
		pressureUpperbound: 30,
		temperatureLowerbound: 600, // unit = kelvin
		temperatureUpperbound: 850,
		steamCarbonRatioLowerbound: 2, // to neglect coke formation
		steamCarbonRatioUpperbound: 8
	};

	static standardPressure = 1.01325;

	static algoConfig: Required<AlgoConfig> = {
		popSize: 20,
		genSize: 20,
		movingAverage: 10,
		mutationProbability: 2
	};

	// On a basis of 100 kmol of natural gas or flare gas
	static gasComposition: Compositions = {
		ch4: 100
	};

	static mbConfig = {
		max: 100,
		min: 0
	};

	// constructor(config?: Config) {
	//   if (config) {
	//     if (config.individualTraitBoundaries) Configuration.individualTraitBoundaries = {
	//       ...Configuration.individualTraitBoundaries,
	//       ...config.individualTraitBoundaries
	//     }
	//     if (config.algoConfig) Configuration.algoConfig = {
	//       ...Configuration.algoConfig,
	//       ...config.algoConfig
	//     }
	//     if (config.gasComposition) Configuration.gasComposition = {
	//       ...Configuration.gasComposition,
	//       ...config.gasComposition
	//     }
	//   }
	// }
}
