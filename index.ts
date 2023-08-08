import { GeneticsAlgorithm } from "./Algorithm";

const main = () => {
  // Create new GeneticsAlgorithm
  // start a while loop that terminates when stopping criteria is reached or gen_size is reached
  // In the loop create next generation
  // On termination of loop
  // log generations to console

  try {
    const algo = new GeneticsAlgorithm(
      { compositions: { 'CH4': 0.9 } },
      {
        genSize: 10,
        popSize: 10,
      }
    )

    while (!algo.stop) {
      algo.createNextGeneration()
    }

    for (const [id, population] of Object.entries(algo.generations)) {
      console.log(`======= Population ${id + 1} ========`)
      console.log(population)
      for (const [id, individual] of Object.entries(population)) {
        console.log(`======= Individual ${id + 1} ========`)
        console.log("fitness: ", individual.fitness)
        console.log("traits: ", individual.traits)
        console.log('=====================================\n')
      }
      console.log('=====================================\n')
    }
  } catch (error) {
    console.log("An Error occured: \n", error)
  }
};


main();