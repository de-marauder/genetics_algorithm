import { Individual } from "./Individual";
import { Compositions, PopulationType } from "./types";

export class Population {

  population: Individual[] = []; // holds current population
  children: Individual[] = []; // holds the current population's offsprings after crossover and mutation
  size: number = 0;
  composition?: Compositions

  constructor(popSize?: number, compositions?: Compositions) {
    this.population = [];
    this.size = popSize ?? 20
    this.composition = compositions
  }

  spawnPopulation(): Individual[] {
    for (let i = 0; i < this.size; i++) {
      const sol = new Individual();
      this.population.push(sol)
    }
    this.orderAccordingToFitness(this.population)
    return this.population
  };

  generateNewPopulation(): void {
    const populationPlusChildren = this.population.concat(this.children);
    this.orderAccordingToFitness(populationPlusChildren)
    this.population = populationPlusChildren.slice(0, this.size);
    this.children = []
  }

  // Sorts individuals in population according to their fitness in place
  orderAccordingToFitness(population: Individual[]): void {
    population.sort((a, b) => {
      return b.fitness - a.fitness
    })
  }

  // Checks if the fitness of all individuals are same
  // return true if so
  get isFit(): boolean {
    const sum = this.population.map((el) => el.fitness).reduce((prev, curr) => {
      return prev + curr
    })
    return (sum) === (this.size * this.population[0].fitness)
  }

}