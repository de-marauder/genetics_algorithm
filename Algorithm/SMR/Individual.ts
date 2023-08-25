import { Configuration } from './Config';
import { getRandomNumberInRange } from '../helpers/functions';
import {
	AlgoConfig,
	Compositions,
	GasComponent,
	IndividualConfig,
	SMRIndividualType,
	SMRTraits
} from './types';
import { MBGeneticsAlgorithm } from '../MB';

export class SMRIndividual {
	traits: SMRIndividualType;
	static traitBoundaries: IndividualConfig;
  standardPressure: number
	flareGasComposition: Compositions;

  gasComponents: GasComponent[];

	mbConfig: AlgoConfig;

	fitness: number;
	y: number;
	a: number;
	b: number;
	h: number;
	f: number;
	k: number;
	error: number;

	changeInCarbon: number;
	changeInHydrogen: number;
	changeInOxygen: number;
	amountOfCarbon: number;
	amountOfHydrogen: number;
	amountOfOxygen: number;
	amountOfWater: number;

	constructor(
		config: {
			mbConfig: AlgoConfig;
			traitBoundaries: IndividualConfig;
      standardPressure: number,
      flareGasComposition: Compositions
		},
		traits?: SMRIndividualType
	) {
		this.mbConfig = { ...config.mbConfig };
		this.traits = this.spawnIndividual(traits);
		SMRIndividual.traitBoundaries = { ...config.traitBoundaries };
    this.standardPressure = config.standardPressure
    this.flareGasComposition = config.flareGasComposition

    this.gasComponents = Object.keys(
      this.flareGasComposition
    ) as GasComponent[];

		const {
			x,
			y,
			a,
			b,
			h,
			f,
			fn,
			changeInCarbon,
			changeInHydrogen,
			changeInOxygen,
			amountOfCarbon,
			amountOfHydrogen,
			amountOfOxygen,
			amountOfWater
		} = this.getFitness();
		this.fitness = x;
		this.y = y;
		this.a = a;
		this.b = b;
		this.h = h;
		this.f = fn;
		this.k = this.equilibrumConstant;
		this.error = f;

		this.changeInCarbon = changeInCarbon;
		this.changeInHydrogen = changeInHydrogen;
		this.changeInOxygen = changeInOxygen;
		this.amountOfCarbon = amountOfCarbon;
		this.amountOfHydrogen = amountOfHydrogen;
		this.amountOfOxygen = amountOfOxygen;
		this.amountOfWater = amountOfWater;
	}

	// Implements the fitness function on an individual
	getFitness() {
		// Perform elemental balance to obtain the conc. of H2 produced as an unknown

		try {
			const mbAlgo = new MBGeneticsAlgorithm({
				mbConfig: this.mbConfig,
				individualConfig: {
					K: this.equilibrumConstant,
					steamCarbonRatio: this.traits.steamCarbonRatio,
					totalPressure: this.traits.pressure,
          flareGasComposition: this.flareGasComposition,
					standardPressure: this.standardPressure,
				}
			});
			let id = 0;
			while (!mbAlgo.stop) {
				mbAlgo.createNextGeneration();

				// console.log(`======= MBPopulation ${+id + 1} ========`)
				// // console.log(population)
				// for (const [id, individual] of Object.entries(mbAlgo.population.population)) {
				//   console.log(`======= MBIndividual ${+id + 1} ========`)
				// console.log("fitness: ", individual.fitness)
				//   console.log("K: ", individual.config.K)
				//   console.log("fn: ", individual.fn)
				// console.log("H2: ", individual.x)
				// console.log("CO2: ", individual.y)
				// console.log("CH4: ", individual.a)
				//   console.log("CO: ", individual.b)
				// console.log("H2O: ", individual.h)
				//   console.log('=====================================\n')
				// }
				// console.log('=====================================\n')
				id++;
			}
			// console.log(`============== pop: ${mbAlgo.population.population.length}===============\n`)
			// console.log(`============== gen: ${mbAlgo.generations.length}===============\n`)
			const {
				x,
				y,
				a,
				b,
				h,
				fitness: f,
				fn,
				changeInCarbon,
				changeInHydrogen,
				changeInOxygen,
				amountOfCarbon,
				amountOfHydrogen,
				amountOfOxygen,
				amountOfWater
			} = mbAlgo.population.population[0];
			this.fitness = x;
			return {
				x,
				y,
				a,
				b,
				h,
				f,
				fn,
				changeInCarbon,
				changeInHydrogen,
				changeInOxygen,
				amountOfCarbon,
				amountOfHydrogen,
				amountOfOxygen,
				amountOfWater
			};
		} catch (error) {
			console.log('An Error occured: \n', error);
			throw error;
		}
	}

	get equilibrumConstant() {
		const K1 =
			((10266.76 * 10) ^
				(6 * Math.exp(-(26830 / this.traits.temperature) + 30.114))) *
			(10 * Math.exp(-5)) ** 2;
		const K2 = Math.exp(4400 / this.traits.temperature + 4.036);
		const K3 = K1 * K2;
		return +K3.toFixed(4);
	}

	// Creates an individual
	spawnIndividual(traits?: SMRIndividualType): SMRIndividualType {
		// Define rules and bounds for selecting each gene [P, T, C/S]
		const pressure =
			traits?.pressure ?? SMRIndividual.generateTrait('pressure');
		const temperature =
			traits?.temperature ?? SMRIndividual.generateTrait('temperature');
		const steamCarbonRatio =
			traits?.steamCarbonRatio ??
			SMRIndividual.generateTrait('steamCarbonRatio');

		return {
			pressure,
			temperature,
			steamCarbonRatio
		};
	}

	static generateTrait(trait: SMRTraits): number {
		if (trait === 'pressure') {
			return this.generatePressureValue();
		} else if (trait === 'temperature') {
			return this.generateTemperatureValue();
		} else if (trait === 'steamCarbonRatio') {
			return this.generateCarbonSteamRatioValue();
		}
		return 0;
	}

	// Generate trait values within specified ranges
	private static generatePressureValue(): number {
		const lowerBound = this.traitBoundaries.pressureLowerbound;
		const upperBound = this.traitBoundaries.pressureUpperbound;

		return getRandomNumberInRange(lowerBound, upperBound);
	}

	private static generateTemperatureValue(): number {
		const lowerBound = this.traitBoundaries.temperatureLowerbound;
		const upperBound = this.traitBoundaries.temperatureUpperbound;

		return getRandomNumberInRange(lowerBound, upperBound);
	}

	private static generateCarbonSteamRatioValue(): number {
		const lowerBound = this.traitBoundaries.steamCarbonRatioLowerbound;
		const upperBound = this.traitBoundaries.steamCarbonRatioUpperbound;

		return getRandomNumberInRange(lowerBound, upperBound);
	}
}
