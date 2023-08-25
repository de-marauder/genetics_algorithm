
export type ValidRunOptions = {
  config: string;
  outdir?: string;
};

export type Config = {
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
  standardPressure: number;
  flareGasComposition: {
    ch4: number;
    c2h6: number;
    c3h8: number;
    'i-c4': number;
    'n-c4': number;
    'i-c5': number;
    'n-c5': number;
    'i-c6': number;
    'n-c6': number;
    h2: number;
    n2: number;
    co2: number;
  };
  traitBoundaries: {
    pressureLowerbound: number;
    pressureUpperbound: number;
    temperatureLowerbound: number;
    temperatureUpperbound: number;
    steamCarbonRatioLowerbound: number;
    steamCarbonRatioUpperbound: number;
  };
  outputFile: string;
};

export type UpdateConfigOptions = {
  path: string
}