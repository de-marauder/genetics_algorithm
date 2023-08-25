"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MBGeneticsAlgorithm = void 0;
const Individual_1 = require("./Individual");
const Population_1 = require("./Population");
const functions_1 = require("../helpers/functions");
class MBGeneticsAlgorithm {
    // Creates initial random population
    constructor({ mbConfig, individualConfig }) {
        this.generations = [];
        this.mbConfig = mbConfig;
        this.individualConfig = individualConfig;
        this.population = new Population_1.MBPopulation({
            individualConfig: this.individualConfig,
            mbConfig: this.mbConfig
        });
        this.population.spawnPopulation();
    }
    // Implements the breeding process to create a new generation and update the current population
    createNextGeneration() {
        for (let i = 0; i < this.population.size; i++) {
            const { individualA, individualB } = this.selectIndividuals();
            let newIndividual = this.crossover(individualA, individualB);
            const willMutate = this.willMutate();
            if (willMutate) {
                // mutatate new individual in place
                newIndividual = this.mutation(newIndividual);
            }
            this.population.children.push(newIndividual);
        }
        this.generations.push([...this.population.population]);
        this.population.generateNewPopulation();
    }
    // Selects two Individuals to mate for crossover
    // Selection favours better fit individuals in the population
    selectIndividuals() {
        // Selection will be based on two modes with 50% probability of either
        // Mode 1: Tournament Selection
        // Mode 2: Biased Roulette Selection
        const probability = Math.random();
        let individualA;
        let individualB;
        if (probability > 0.5) {
            // Do tournament selection
            individualA = this.tournamentSelection();
            individualB = this.tournamentSelection();
            while (individualA === individualB)
                individualB = this.tournamentSelection();
        }
        else {
            // Do biased roulette selection
            individualA = this.biasedRouletteSelection();
            individualB = this.biasedRouletteSelection();
            while (individualA === individualB)
                individualB = this.biasedRouletteSelection();
        }
        return { individualA, individualB };
    }
    // Implements the tournament selection procedure
    // Two unique individuals are chosen from the population at random
    // The better fit individual out of the two is returned
    tournamentSelection() {
        const a = (0, functions_1.roundToNearestInteger)(Math.random() * (this.mbConfig.popSize - 1));
        let b = (0, functions_1.roundToNearestInteger)(Math.random() * (this.mbConfig.popSize - 1));
        while (a === b)
            b = (0, functions_1.roundToNearestInteger)(Math.random() * (this.mbConfig.popSize - 1));
        const individualA = this.population.population[a];
        const individualB = this.population.population[b];
        if (individualA.fitness > individualB.fitness)
            return individualA;
        else
            return individualB;
    }
    // Implements the biased roulette wheel selection approach
    // A probability distribution is created based on the fitness of each individual
    // A cummulation of the distribution is evaluated
    // An individual is then selected randomly from the cummulated probability distribution
    biasedRouletteSelection() {
        const fitnessArr = this.population.population.map(el => el.fitness);
        // Since higher fitness values is preferred
        // we just take the quotient of the fitness and sum of fitnesses
        const sum = fitnessArr.reduce((prev, curr) => prev + curr);
        const probabilityDistribution = fitnessArr.map(el => el / sum);
        const cummulatedProbabilityDistribution = [];
        let cummulatedSum = 0;
        for (let i = 0; i < probabilityDistribution.length; i++) {
            cummulatedSum = cummulatedSum + probabilityDistribution[i];
            cummulatedProbabilityDistribution.push(cummulatedSum);
        }
        const randProb = Math.random();
        for (let i = 0; i < cummulatedProbabilityDistribution.length; i++) {
            if (cummulatedProbabilityDistribution[i] > randProb) {
                return this.population.population[i];
            }
        }
        throw new Error('Biased roulette selection could not select an individual');
    }
    // Combines two individual's traits to form a new individual
    // Mode 1: Averaging
    // Mode 2: random selection of certain traits
    // Mode 3:
    crossover(individualA, individualB) {
        const modeSelectorProbabilty = Math.random();
        if (modeSelectorProbabilty > 0.2) {
            // Do Mode 1
            return this.crossOverByNormalAveraging(individualA, individualB);
        }
        else {
            // Do mode 2
            return this.crossOverByRandomBiasedAveraging(individualA, individualB);
        }
    }
    // Averages all the individual traits
    crossOverByNormalAveraging(individualA, individualB) {
        const x = +((individualA.x + individualB.x) / 2).toFixed(2);
        const y = +((individualA.y + individualB.y) / 2).toFixed(2);
        return new Individual_1.MBIndividual(this.individualConfig, x, y);
    }
    // averages the values of individual based on a random probability
    // Weights for averaging are selected randomly and
    // Biased to favour better parent's traits
    crossOverByRandomBiasedAveraging(individualA, individualB) {
        var _a, _b;
        const probability = Math.random();
        const better = Math.max(individualA.fitness, individualB.fitness);
        let x = (_a = [individualA, individualB].find(el => {
            el.fitness === better;
        })) === null || _a === void 0 ? void 0 : _a.x;
        let y = (_b = [individualA, individualB].find(el => {
            el.fitness === better;
        })) === null || _b === void 0 ? void 0 : _b.y;
        if (individualA.fitness === better && probability > 0.5) {
            x = +(probability * individualA.x +
                (1 - probability) * individualB.x).toFixed(4);
            y = +(probability * individualA.y +
                (1 - probability) * individualB.y).toFixed(4);
        }
        else if (individualA.fitness === better && probability < 0.5) {
            x = +((1 - probability) * individualA.x +
                probability * individualB.x).toFixed(4);
            y = +((1 - probability) * individualA.y +
                probability * individualB.y).toFixed(4);
        }
        else if (individualB.fitness === better && probability > 0.5) {
            x = +((1 - probability) * individualA.x +
                probability * individualB.x).toFixed(4);
            y = +((1 - probability) * individualA.y +
                probability * individualB.y).toFixed(4);
        }
        else if (individualB.fitness === better && probability < 0.5) {
            x = +(probability * individualA.x +
                (1 - probability) * individualB.x).toFixed(4);
            y = +(probability * individualA.y +
                (1 - probability) * individualB.y).toFixed(4);
        }
        return new Individual_1.MBIndividual(this.individualConfig, x, y);
    }
    // Changes an individual to encourage randomness in algorithm
    mutation(individualA) {
        // const x = getRandomNumberInRange(MBConfiguration.xmin, MBConfiguration.xmax)
        // const y = getRandomNumberInRange(MBConfiguration.ymin, MBConfiguration.ymax)
        const newIndividual = new Individual_1.MBIndividual(this.individualConfig);
        return newIndividual;
    }
    // Evalutes whether mutation should occur based on a 2% probability
    willMutate() {
        const n = Math.random() * 100;
        return +n.toFixed(0) < this.mbConfig.mutationProbability;
    }
    // eveluates stopping criteria
    get stop() {
        return (this.population.isFit ||
            this.hasConverged ||
            this.generations.length >= this.mbConfig.genSize);
    }
    // Checks convergence based on a moving average over a specific number of points.
    // If the last 10 best points are identical, convergence has been reached
    get hasConverged() {
        const movingAverageSize = this.mbConfig.movingAverage;
        if (this.generations.length > movingAverageSize) {
            const listOfBestIndividuals = this.generations
                .slice(-1 * movingAverageSize)
                .map(el => el[0]);
            const listOfBestIndividualsFitness = listOfBestIndividuals.map(el => el.fitness);
            const movingAverage = +(listOfBestIndividualsFitness.reduce((prev, curr) => prev + curr) / movingAverageSize).toFixed(4);
            const converged = +movingAverage.toFixed(4) === listOfBestIndividualsFitness[0];
            if (converged)
                console.log(`========== MB HAS CONVERGED after ${this.generations.length} genenrations ============`);
            return converged;
        }
        return false;
    }
}
exports.MBGeneticsAlgorithm = MBGeneticsAlgorithm;
