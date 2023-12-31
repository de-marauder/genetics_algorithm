#! /usr/bin/env node

import { SMRGeneticsAlgorithm } from './SMR';
import { Compositions, IndividualConfig } from './SMR/types';
import {
  createFileIfNotExists,
  writeToFileInTableFormat
} from './helpers/functions';

export const main = ({
  populationResultsFile,
  compositions,
  smrConfig,
  mbConfig,
  traitBoundaries,
  standardPressure
}: {
  populationResultsFile: string;
  compositions: Compositions;
  smrConfig: {
    smrPopSize: number;
    smrGenSize: number;
    smrMovingAverage: number;
    smrMutationProbability: number;
  };
  mbConfig: {
    mbPopSize: number;
    mbGenSize: number;
    mbMovingAverage: number;
    mbMutationProbability: number;
  };
  traitBoundaries: IndividualConfig;
  standardPressure: number
}) => {
  // try {
    // const populationResultsFile = populationResultsFile
    createFileIfNotExists(populationResultsFile);
    // createFileIfNotExists('individual_results.txt');
    // Create new GeneticsAlgorithm
    // start a while loop that terminates when stopping criteria is reached or gen_size is reached
    // In the loop create next generation
    // On termination of loop
    // log generations to console
    const start = Date.now();
    const algo = new SMRGeneticsAlgorithm(
      { compositions },
      {
        smrConfig: {
          genSize: smrConfig.smrGenSize,
          popSize: smrConfig.smrPopSize,
          movingAverage: smrConfig.smrMovingAverage,
          mutationProbability: smrConfig.smrMutationProbability
        },
        mbConfig: {
          genSize: mbConfig.mbGenSize,
          popSize: mbConfig.mbPopSize,
          movingAverage: mbConfig.mbMovingAverage,
          mutationProbability: mbConfig.mbMutationProbability
        },
        traitBoundaries,
        standardPressure
      }
    );

    const populationLines: string[][] = [];
    // const populationFirstLine: string[] = []
    // const individualFirstLine: string[] = []
    const firstLine: string[] = [];
    for (const id of Object.keys(algo.population.population)) {
      firstLine.push(`Population ${+id + 1}`);
    }
    populationLines.push(firstLine);

    // writeLineToFileInColumnatedFormat(populationResultsFile, populationFirstLine)
    let id = 0;
    while (!algo.stop) {
      console.log(`\n======= SMR Population ${+id + 1} ========`);
      algo.createNextGeneration();
      // }

      // for (const [id, population] of Object.entries(algo.generations)) {

      // console.log(population)
      const line = [];
      for (const [, individual] of Object.entries(
        algo.population.population
      )) {
        let column = '';
        column += `fitness = ${individual.fitness.toFixed(2)} kmol  `;
        column += `pres = ${individual.traits.pressure.toFixed(
          2
        )} bar  `;
        column += `temp = ${individual.traits.temperature.toFixed(
          2
        )} K  `;
        column += `C/S = ${individual.traits.steamCarbonRatio.toFixed(
          2
        )}  `;
        column += `H2 = ${individual.fitness.toFixed(2)} kmol  `;
        column += `CO2 = ${individual.y.toFixed(2)} kmol  `;
        column += `CO = ${individual.b.toFixed(2)} kmol  `;
        column += `H2O = ${individual.h.toFixed(2)} kmol  `;
        column += `CH4 = ${individual.a.toFixed(2)} kmol  `;

        // console.log(`======= SMR Individual ${+id + 1} ========`)
        // console.log("traits: ", individual.traits)
        // console.log("H2: ", individual.fitness)
        // console.log("CO2: ", individual.y)
        // console.log('CH4: ', individual.a)
        // console.log("H2O: ", individual.h)
        // // console.log("CO: " , individual.b)
        // console.log('=====================================\n')
        line.push(column);
      }
      populationLines.push(line);
      console.log(
        JSON.stringify(algo.population.population.map(el => `{${el.fitness}; ${el.traits.pressure}}`))
          .split(',')
          .join(',    ')
      );
      console.log('=====================================\n');
      id++;
    }
    // console.log(`\n======= BEST SMR Population ========`)
    // console.log("\nPopulation: ", algo.population.population.map(el=> { return {fitness: el.fitness, traits: el.traits}}))
    console.log(`\n======= BEST SMR Individual ========`);
    console.log('traits: ', algo.population.population[0].traits);
    console.log('H2: ', algo.population.population[0].fitness);
    console.log('CO2: ', algo.population.population[0].y);
    console.log('CH4: ', algo.population.population[0].a);
    console.log('CO: ', algo.population.population[0].b);
    console.log('H2O: ', algo.population.population[0].h);
    console.log('K1K2: ', algo.population.population[0].K1K2);
    console.log('K: ', algo.population.population[0].k);
    console.log('f: ', algo.population.population[0].f);
    console.log('e: ', algo.population.population[0].error);
    console.log('=====================================\n');
    writeToFileInTableFormat(populationResultsFile, populationLines);
    const end = Date.now();

    // console.log(`============== pop: ${algo.population.population.length}===============\n`)
    // console.log(`============== gen: ${algo.generations.length}===============\n`)
    console.log(
      `============== time taken: ${(end - start) / 1000 / 60
      } mins ===============\n`
    );
    // console.log(populationLines)
  // } catch (error) {
  //   console.log ('An error occured')
  //   throw new Error((error as Error).message)
  // }
};

// main();
