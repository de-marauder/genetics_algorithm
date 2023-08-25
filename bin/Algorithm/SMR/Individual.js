"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMRIndividual = void 0;
const functions_1 = require("../helpers/functions");
const MB_1 = require("../MB");
class SMRIndividual {
    constructor(config, traits) {
        this.mbConfig = Object.assign({}, config.mbConfig);
        this.traits = this.spawnIndividual(traits);
        SMRIndividual.traitBoundaries = Object.assign({}, config.traitBoundaries);
        this.standardPressure = config.standardPressure;
        this.flareGasComposition = config.flareGasComposition;
        this.gasComponents = Object.keys(this.flareGasComposition);
        const { x, y, a, b, h, f, fn, changeInCarbon, changeInHydrogen, changeInOxygen, amountOfCarbon, amountOfHydrogen, amountOfOxygen, amountOfWater } = this.getFitness();
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
            const mbAlgo = new MB_1.MBGeneticsAlgorithm({
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
            const { x, y, a, b, h, fitness: f, fn, changeInCarbon, changeInHydrogen, changeInOxygen, amountOfCarbon, amountOfHydrogen, amountOfOxygen, amountOfWater } = mbAlgo.population.population[0];
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
        }
        catch (error) {
            console.log('An Error occured: \n', error);
            throw error;
        }
    }
    get equilibrumConstant() {
        const K1 = ((10266.76 * 10) ^
            (6 * Math.exp(-(26830 / this.traits.temperature) + 30.114))) *
            (10 * Math.exp(-5)) ** 2;
        const K2 = Math.exp(4400 / this.traits.temperature + 4.036);
        const K3 = K1 * K2;
        return +K3.toFixed(4);
    }
    // Creates an individual
    spawnIndividual(traits) {
        var _a, _b, _c;
        // Define rules and bounds for selecting each gene [P, T, C/S]
        const pressure = (_a = traits === null || traits === void 0 ? void 0 : traits.pressure) !== null && _a !== void 0 ? _a : SMRIndividual.generateTrait('pressure');
        const temperature = (_b = traits === null || traits === void 0 ? void 0 : traits.temperature) !== null && _b !== void 0 ? _b : SMRIndividual.generateTrait('temperature');
        const steamCarbonRatio = (_c = traits === null || traits === void 0 ? void 0 : traits.steamCarbonRatio) !== null && _c !== void 0 ? _c : SMRIndividual.generateTrait('steamCarbonRatio');
        return {
            pressure,
            temperature,
            steamCarbonRatio
        };
    }
    static generateTrait(trait) {
        if (trait === 'pressure') {
            return this.generatePressureValue();
        }
        else if (trait === 'temperature') {
            return this.generateTemperatureValue();
        }
        else if (trait === 'steamCarbonRatio') {
            return this.generateCarbonSteamRatioValue();
        }
        return 0;
    }
    // Generate trait values within specified ranges
    static generatePressureValue() {
        const lowerBound = this.traitBoundaries.pressureLowerbound;
        const upperBound = this.traitBoundaries.pressureUpperbound;
        return (0, functions_1.getRandomNumberInRange)(lowerBound, upperBound);
    }
    static generateTemperatureValue() {
        const lowerBound = this.traitBoundaries.temperatureLowerbound;
        const upperBound = this.traitBoundaries.temperatureUpperbound;
        return (0, functions_1.getRandomNumberInRange)(lowerBound, upperBound);
    }
    static generateCarbonSteamRatioValue() {
        const lowerBound = this.traitBoundaries.steamCarbonRatioLowerbound;
        const upperBound = this.traitBoundaries.steamCarbonRatioUpperbound;
        return (0, functions_1.getRandomNumberInRange)(lowerBound, upperBound);
    }
}
exports.SMRIndividual = SMRIndividual;
