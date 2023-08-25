"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Population = void 0;
const Individual_1 = require("./Individual");
class Population {
    constructor(popSize, compositions) {
        this.population = []; // holds current population
        this.children = []; // holds the current population's offsprings after crossover and mutation
        this.size = 0;
        this.population = [];
        this.size = popSize !== null && popSize !== void 0 ? popSize : 20;
        this.composition = compositions;
    }
    spawnPopulation({ mbConfig, traitBoundaries, standardPressure, flareGasComposition }) {
        for (let i = 0; i < this.size; i++) {
            const sol = new Individual_1.SMRIndividual({
                mbConfig,
                traitBoundaries,
                standardPressure,
                flareGasComposition
            });
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
        // console.log('unordered pop: ', population.map((el)=>el.fitness))
        population.sort((a, b) => {
            return b.fitness - a.fitness;
        });
        // console.log('ordered pop: ', population.map((el)=>el.fitness))
    }
    // Checks if the fitness of all individuals are same
    // return true if so
    get isFit() {
        const sum = this.population
            .map(el => el.fitness)
            .reduce((prev, curr) => {
            return prev + curr;
        });
        const fit = sum === this.size * this.population[0].fitness;
        if (fit)
            console.log(`========== IS FIT ============`);
        return fit;
    }
}
exports.Population = Population;
