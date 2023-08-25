"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMRGeneticsAlgorithm = void 0;
const Individual_1 = require("./Individual");
const Population_1 = require("./Population");
const functions_1 = require("../helpers/functions");
class SMRGeneticsAlgorithm {
    // Creates initial random population
    constructor({ compositions }, config) {
        this.generations = [];
        this.mutationCounter = 0;
        this.compositions = compositions;
        this.mbConfig = config.mbConfig;
        this.traitBoundaries = config.traitBoundaries;
        this.standardPressure = config.standardPressure;
        Individual_1.SMRIndividual.traitBoundaries = this.traitBoundaries;
        this.config = Object.assign({}, config.smrConfig);
        this.population = new Population_1.Population(this.config.popSize, compositions);
        this.population.spawnPopulation({
            mbConfig: config.mbConfig,
            traitBoundaries: config.traitBoundaries,
            standardPressure: this.standardPressure,
            flareGasComposition: this.compositions
        });
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
        const a = (0, functions_1.roundToNearestInteger)(Math.random() * (this.config.popSize - 1));
        let b = (0, functions_1.roundToNearestInteger)(Math.random() * (this.config.popSize - 1));
        while (a === b)
            b = (0, functions_1.roundToNearestInteger)(Math.random() * (this.config.popSize - 1));
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
        if (modeSelectorProbabilty > 0.5) {
            // Do Mode 1
            return this.crossOverByRandomBiasedAveraging(individualA, individualB);
        }
        else {
            // Do mode 2
            return this.crossOverByRandomSelection(individualA, individualB);
        }
    }
    // Averages all the individual traits
    // Weights for averaging are selected randomly and
    // Biased to favour better parent's traits
    crossOverByRandomBiasedAveraging(individualA, individualB) {
        const newIndividualTraits = {
            pressure: 0,
            temperature: 0,
            steamCarbonRatio: 0
        };
        const probability = Math.random();
        const better = Math.max(individualA.fitness, individualB.fitness);
        for (const k in newIndividualTraits) {
            if (individualA.fitness === better && probability > 0.5) {
                newIndividualTraits[k] = +(probability *
                    (individualA.traits[k] +
                        (1 - probability) * individualB.traits[k])).toFixed(4);
            }
            else if (individualA.fitness === better && probability < 0.5) {
                newIndividualTraits[k] = +((1 - probability) *
                    (individualA.traits[k] +
                        probability * individualB.traits[k])).toFixed(4);
            }
            else if (individualB.fitness === better && probability > 0.5) {
                newIndividualTraits[k] = +((1 - probability) *
                    (individualA.traits[k] +
                        probability * individualB.traits[k])).toFixed(4);
            }
            else if (individualB.fitness === better && probability < 0.5) {
                newIndividualTraits[k] = +(probability *
                    (individualA.traits[k] +
                        (1 - probability) * individualB.traits[k])).toFixed(4);
            }
        }
        return new Individual_1.SMRIndividual({
            mbConfig: this.mbConfig,
            traitBoundaries: this.traitBoundaries,
            standardPressure: this.standardPressure,
            flareGasComposition: this.compositions
        }, newIndividualTraits);
    }
    // selects a random trait from either parent based on a random probabilty (50% chance of A or B)
    // The other traits are then filled in from the other parent
    crossOverByRandomSelection(individualA, individualB) {
        const newIndividualTraits = Object.assign({}, functions_1.defaultNewIndividualTraits);
        const traitsList = Object.entries(newIndividualTraits);
        const probability = Math.random();
        const randomId = (0, functions_1.roundToNearestInteger)(Math.random() * (traitsList.length - 1));
        const randKey = traitsList[randomId][0];
        const othersList = traitsList.filter((_, id) => id !== randomId);
        if (probability < 0.5) {
            // select randKey from A and the others from B
            newIndividualTraits[randKey] =
                individualA.traits[randKey];
            for (const [k] of othersList) {
                newIndividualTraits[k] =
                    individualB.traits[k];
            }
        }
        else {
            // select randKey from B and the others from A
            newIndividualTraits[randKey] =
                individualB.traits[randKey];
            for (const [k] of othersList) {
                newIndividualTraits[k] =
                    individualA.traits[k];
            }
        }
        return new Individual_1.SMRIndividual({
            mbConfig: this.mbConfig,
            traitBoundaries: this.traitBoundaries,
            standardPressure: this.standardPressure,
            flareGasComposition: this.compositions
        }, newIndividualTraits);
    }
    // Changes certain traits of an individual to encourage randomness in algorithm
    // Select number of traits to change randomly
    // Get their keys
    // Change them
    mutation(individualA) {
        // individualA.getFitness()
        const newIndividualTraits = Object.assign({}, individualA.traits);
        const traitsList = Object.entries(newIndividualTraits);
        const numberOfTraitsToChange = (0, functions_1.roundToNearestInteger)(Math.random() * traitsList.length);
        const idList = [];
        for (let i = 0; i < numberOfTraitsToChange; i++) {
            const randomId = (0, functions_1.roundToNearestInteger)(Math.random() * (traitsList.length - 1));
            idList.push(randomId);
        }
        const mutableTraits = traitsList.filter((_, id) => idList.includes(id));
        for (const [k] of mutableTraits) {
            newIndividualTraits[k] = Individual_1.SMRIndividual.generateTrait(k);
        }
        const newIndividual = new Individual_1.SMRIndividual({
            mbConfig: this.mbConfig,
            traitBoundaries: this.traitBoundaries,
            standardPressure: this.standardPressure,
            flareGasComposition: this.compositions
        }, newIndividualTraits);
        this.mutationCounter += 1;
        return newIndividual;
    }
    // Evalutes whether mutation should occur based on a 2% probability
    willMutate() {
        const n = (0, functions_1.getRandomNumberInRange)(0, 100);
        return +n.toFixed(0) > this.config.mutationProbability;
    }
    // eveluates stopping criteria
    get stop() {
        return (this.population.isFit ||
            this.hasConverged ||
            this.generations.length >= this.config.genSize);
    }
    // Checks convergence based on a moving average over a specific number of points.
    // If the last 10 best points are identical, convergence has been reached
    get hasConverged() {
        var _a, _b;
        const movingAverageSize = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.movingAverage) !== null && _b !== void 0 ? _b : 10;
        if (this.generations.length > movingAverageSize) {
            const listOfBestIndividuals = this.generations
                .slice(-1 * movingAverageSize)
                .map(el => el[0]);
            const listOfBestIndividualsFitness = listOfBestIndividuals.map(el => el.fitness);
            const movingAverage = listOfBestIndividualsFitness.reduce((prev, curr) => prev + curr) / movingAverageSize;
            const converged = +movingAverage.toFixed(4) === listOfBestIndividualsFitness[0];
            if (converged) {
                console.log(`========== SMR HAS CONVERGED after ${this.generations.length} genenrations ============`);
            }
            return converged;
        }
        return false;
    }
}
exports.SMRGeneticsAlgorithm = SMRGeneticsAlgorithm;
