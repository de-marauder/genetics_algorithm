import { AlgoConfig } from '../SMR/types';

export class MBConfiguration {
	static xmin = 100;
	static xmax = 500;
	static ymin = 0;
	static ymax = 100;

	static algoConfig: Required<AlgoConfig> = {
		popSize: 20,
		genSize: 20,
		movingAverage: 10,
		mutationProbability: 2
	};
}
