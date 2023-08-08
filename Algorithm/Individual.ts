import { IndividualType, Traits } from "./types";



export class Individual {

  traits: IndividualType;

  constructor(traits?: IndividualType) {
    this.traits = this.spawnIndividual(traits)
  }

  // Implements the fitness function on an individual
  get fitness() { return 1 }

  // Creates an individual
  spawnIndividual(traits?: IndividualType): IndividualType {
    // Define rules and bounds for selecting each gene [P, T, C/S]
    const pressure = traits?.pressure ?? Individual.generateTrait('pressure');
    const temperature = traits?.temperature ?? Individual.generateTrait('temperature');
    const carbonSteamRatio = traits?.carbonSteamRatio ?? Individual.generateTrait('carbonSteamRatio');

    return {
      pressure,
      temperature,
      carbonSteamRatio
    }
  }

  static generateTrait (trait: Traits): number {
    if (trait === 'pressure') {
      return this.generatePressureValue()
    }
    else if (trait === 'temperature') {
      return this.generateTemperatureValue()
    }
    else if (trait === 'carbonSteamRatio') {
      return this.generateCarbonSteamRatioValue()
    }
    return 0
  }

  static generatePressureValue(): number { return 0 }
  static generateTemperatureValue(): number { return 0 }
  static generateCarbonSteamRatioValue(): number { return 0 }

}