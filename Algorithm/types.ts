
export type Compositions = Partial<{
  'N2': number,
  'CO2': number,
  'CH4': number,
  'C2H6': number,
  'C3H8': number,
  'i-C4': number,
  'n-C4': number,
  'i-C5': number,
  'n-C5': number,
  'i-C6': number,
  'n-C6': number
}>

export type IndividualType = {
  pressure: number,
  temperature: number,
  carbonSteamRatio: number
}

export type Traits = keyof IndividualType

export type PopulationType = IndividualType[]

export type AlgoConfig = {
  popSize: number;
  genSize: number
  movingAverage?: number;
  mutationProbability?: number
}