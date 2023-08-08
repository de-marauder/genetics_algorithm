export function roundToNearestInteger(number: number): number {
  const integerPart = Math.floor(number);
  const decimalPart = number - integerPart;

  if (decimalPart < 0.4) {
    return integerPart;
  } else {
    return integerPart + 1;
  }
}

export const defaultNewIndividualTraits = {
  pressure: 0,
  temperature: 0,
  carbonSteamRatio: 0
}