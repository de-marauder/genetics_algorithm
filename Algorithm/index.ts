import { Individual } from "./Individual";
import { Population } from "./Population";
import { defaultNewIndividualTraits, roundToNearestInteger } from "./helpers/functions";
import { AlgoConfig, Compositions, IndividualType, Traits } from "./types";


export class GeneticsAlgorithm {
  generations: Individual[][] = []
  population: Population
  config: Required<AlgoConfig> = {
    popSize: 20,
    genSize: 20,
    movingAverage: 10,
    mutationProbability: 2,
  }

  // Creates initial random population
  constructor({ compositions }: {
    compositions?: Compositions
  }, config: AlgoConfig) {
    this.config = {...this.config, ...config}
    this.population = new Population(this.config.popSize, compositions);
    this.population.spawnPopulation();
  }

  // Implements the breeding process to create a new generation and update the current population
  createNextGeneration(): void {
    const { individualA, individualB } = this.selectIndividuals();
    let newIndividual = this.crossover(individualA, individualB);
    const willMutate = this.willMutate();

    if (willMutate) {
      // mutatate new individual in place
      this.mutation(newIndividual)
    }

    this.population.children.push(newIndividual)
    this.generations.push([...this.population.population])
    this.population.generateNewPopulation()
  }

  // Selects two Individuals to mate for crossover
  // Selection favours better fit individuals in the population
  selectIndividuals(): { individualA: Individual, individualB: Individual } {
    // Selection will be based on two modes with 50% probability of either
    // Mode 1: Tournament Selection
    // Mode 2: Biased Roulette Selection
    const probability = Math.random();

    let individualA: Individual
    let individualB: Individual
    if (probability > 0.5) {
      // Do tournament selection
      individualA = this.tournamentSelection()
      individualB = this.tournamentSelection()
      while (individualA === individualB) individualB = this.tournamentSelection()
    } else {
      // Do biased roulette selection
      individualA = this.biasedRouletteSelection()
      individualB = this.biasedRouletteSelection()
      while (individualA === individualB) individualB = this.biasedRouletteSelection()
    }
    return { individualA, individualB }
  }

  // Implements the tournament selection procedure
  // Two unique individuals are chosen from the population at random
  // The better fit individual out of the two is returned
  tournamentSelection(): Individual {
    const a = roundToNearestInteger(Math.random() * (this.config.popSize - 1))
    let b = roundToNearestInteger(Math.random() * (this.config.popSize - 1))
    while (a === b) b = roundToNearestInteger(Math.random() * (this.config.popSize - 1))

    const individualA = this.population.population[a]
    const individualB = this.population.population[b]

    if (individualA.fitness > individualB.fitness) return individualA
    else return individualB
  }

  // Implements the biased roulette wheel selection approach
  // A probability distribution is created based on the fitness of each individual
  // A cummulation of the distribution is evaluated
  // An individual is then selected randomly from the cummulated probability distribution
  biasedRouletteSelection(): Individual {
    const fitnessArr = this.population.population.map(((el) => el.fitness))
    // Since higher fitness values is preferred
    // we just take the quotient of the fitness and sum of fitnesses
    const sum = fitnessArr.reduce((prev, curr) => prev + curr);
    const probabilityDistribution = fitnessArr.map((el) => el / sum);

    const cummulatedProbabilityDistribution: number[] = []
    let cummulatedSum = 0;
    for (let i = 0; i < probabilityDistribution.length; i++) {
      cummulatedSum = cummulatedSum + probabilityDistribution[i]
      cummulatedProbabilityDistribution.push(cummulatedSum)
    }

    const randProb = Math.random();

    for (let i = 0; i < cummulatedProbabilityDistribution.length; i++) {
      if (cummulatedProbabilityDistribution[i] > randProb) {
        return this.population.population[i]
      }
    }
    throw new Error("Biased roulette selection could not select an individual")
  }

  // Combines two individual's traits to form a new individual
  // Mode 1: Averaging
  // Mode 2: random selection of certain traits
  // Mode 3: 
  crossover(individualA: Individual, individualB: Individual): Individual {
    const modeSelectorProbabilty = Math.random();
    if (modeSelectorProbabilty > 0.5) {
      // Do Mode 1
      return this.crossOverByAveraging(individualA, individualB)
    } else {
      // Do mode 2
      return this.crossOverByRandomSelection(individualA, individualB)
    }
  }

  // Averages all the individual traits
  crossOverByAveraging(individualA: Individual, individualB: Individual): Individual {

    const newIndividualTraits: IndividualType = {
      pressure: 0,
      temperature: 0,
      carbonSteamRatio: 0
    }

    for (const k in newIndividualTraits) {
      newIndividualTraits[k as Traits] = +((individualA.traits[k as Traits] + individualB.traits[k as Traits]) / 2).toFixed(2)
      // newIndividualTraits.pressure = +((individualA.traits.pressure + individualB.traits.pressure) / 2).toFixed(2)
      // newIndividualTraits.temperature = +((individualA.traits.temperature + individualB.traits.temperature) / 2).toFixed(2)
      // newIndividualTraits.carbonSteamRatio = +((individualA.traits.carbonSteamRatio + individualB.traits.carbonSteamRatio) / 2).toFixed(2)
    }

    return new Individual(newIndividualTraits)
  }

  // selects a random trait from either parent (50% chance of A or B) based on a random probabilty
  // The other traits are then filled in from the other parent
  crossOverByRandomSelection(individualA: Individual, individualB: Individual): Individual {
    const newIndividualTraits = { ...defaultNewIndividualTraits }

    const traitsList = Object.entries(newIndividualTraits)
    const probability = Math.random()
    const randomId = roundToNearestInteger(Math.random() * (traitsList.length - 1));
    const randKey = traitsList[randomId][0]
    const othersList = traitsList.filter((_, id) => id !== randomId)

    if (probability < 0.5) {
      // select randKey from A and the others from B
      newIndividualTraits[randKey as Traits] = individualA.traits[randKey as Traits];

      for (const [k,] of othersList) {
        newIndividualTraits[k as Traits] = individualB.traits[k as Traits];
      }
    } else {
      // select randKey from B and the others from A
      newIndividualTraits[randKey as Traits] = individualB.traits[randKey as Traits];

      for (const [k,] of othersList) {
        newIndividualTraits[k as Traits] = individualA.traits[k as Traits];
      }
    }

    return new Individual(newIndividualTraits)
  }

  // Changes certain traits of an individual to encourage randomness in algorithm
  // Select number of traits to change randomly
  // Get their keys
  // Change them
  mutation(individualA: Individual): Individual {
    const newIndividualTraits = { ...individualA.traits };
    const traitsList = Object.entries(newIndividualTraits);

    const numberOfTraitsToChange = roundToNearestInteger(Math.random() * (traitsList.length));
    const idList: Array<number> = [];
    for (let i = 0; i < numberOfTraitsToChange; i++) {
      const randomId = roundToNearestInteger(Math.random() * (traitsList.length - 1));
      idList.push(randomId);
    }

    const mutableTraits = traitsList.filter((_, id)=> idList.includes(id));

    for (const [k] of mutableTraits) {
      newIndividualTraits[k as Traits] = Individual.generateTrait(k as Traits);
    }

    individualA.traits = newIndividualTraits
    return individualA
  }

  // Evalutes whether mutation should occur based on a 2% probability
  willMutate(): boolean {
    const n = Math.random() * 100
    return +(n.toFixed(0)) < (this.config.mutationProbability)
  }

  // eveluates stopping criteria
  get stop(): boolean {
    return this.population.isFit || this.hasConverged || (this.generations.length > this.config.genSize)
  }

  // Checks convergence based on a moving average over a specific number of points.
  // If the last 10 best points are identical, convergence has been reached
  get hasConverged() {
    const movingAverageSize = this.config?.movingAverage ?? 10
    if (this.generations.length > movingAverageSize) {
      const listOfBestIndividuals = this.generations.slice(-1 * movingAverageSize).map((el) => el[0]);
      const listOfBestIndividualsFitness = listOfBestIndividuals.map((el) => el.fitness);

      const movingAverage = listOfBestIndividualsFitness.reduce((prev, curr) => prev + curr) / movingAverageSize

      return movingAverage === listOfBestIndividualsFitness[movingAverage]
    }
    return false
  }
}