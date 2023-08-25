'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Population = void 0;
const Individual_1 = require('./Individual');
// import { Compositions, PopulationType } from "../types";
class Population {
	constructor(popSize) {
		this.population = []; // holds current population
		this.children = []; // holds the current population's offsprings after crossover and mutation
		this.size = 0;
		this.population = [];
		this.size = popSize !== null && popSize !== void 0 ? popSize : 20;
	}
	spawnPopulation() {
		for (let i = 0; i < this.size; i++) {
			const sol = new Individual_1.Individual();
			this.population.push(sol);
		}
		this.orderAccordingToFitness(this.population);
		return this.population;
	}
	generateNewPopulation() {
		const populationPlusChildren = this.population.concat(this.children);
		this.orderAccordingToFitness(populationPlusChildren);
		this.population = populationPlusChildren.slice(0, this.size);
		this.children = [];
	}
	// Sorts individuals in population according to their fitness in place
	orderAccordingToFitness(population) {
		population.sort((a, b) => {
			return b.fitness - a.fitness;
		});
	}
	// Checks if the fitness of all individuals are same
	// return true if so
	get isFit() {
		const sum = this.population
			.map(el => el.fitness)
			.reduce((prev, curr) => {
				return prev + curr;
			});
		return sum === this.size * this.population[0].fitness;
	}
}
exports.Population = Population;
