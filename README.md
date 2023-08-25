# An Implementation of a Genetics Algorithm to Optimize Hydrogen Production From a Steam Methane Reforming Reaction

This algorithm will focus on finding the following optimal parameters:
1. Operation Pressure (Pt)
2. Operation Temperature (T)
3. Carbon - water(steam) ratio (C/S)

## Genetics Algorithm Rundown

STEP 1:
> - Algorithm accepts natural gas composition (moles), population size (n) and max no of generations (G)
> -  Create a random population set of size n
> -  Each element (individual) of the set contains random values for the optimal parameters

STEP 2:
> - Perfom the material balance procedures for each unique individual in the population
> - Obtain the concentrations of hydrogen [y(h2)], carbon-dioxide [y(CO2)] and methane [y(CH4)] in the output of every individual and store

STEP 3:
> - Pass the stored list of concentration values to a fitness function to rank and sort the current population in order of decreasing y(h2)

STEP 4:
> - Perform cross over and mutation operations conditionally and generate new generation

STEP 5:
> - Iterate from step 2 until convergence is reached

STEP 6:
> Convergence criteria shall be:
>   - Max number of generations (G)
>   - Overfitting (when the average of the last 10 generations remaains the same for over 10 generations)

STEP 7:
- Compare results with actual data

## Material Balance Procedure For Implementing the Fitness function

The reaction occurs in two main stages

1. > CH4 + H2O  <-->  CO + 3H2 (reforming)
   > 
   > **Input**: Natural gas (a mixture of hydrocarbons and other gases) and H20
   > 
   > **Output**: CO and H2 (syn gas)

2. > CO + 2H2O  <-->  CO2 + 2H2 (water gas shift)

3. > Total reaction: CH4 + 2H2O => CO2 + 4H2

STEP 1:
- > Identify the composition of the components of the natural gas
- > Draw up an input output table showing the composition of all components involved in the reaction using the carbon - steam ratio (C/S)
- > The algorithm will generate a value for C/S

STEP 2
- > Select two unknown components and make them 'x' and 'y'. Then, solve for other unknown outputs using elemental balances in terms of 'x' and 'y'
- > Find the mole fraction (yi = moles of i/total no of moles in output) of the output components in the gas phase

STEP 3
- Calculate equilibrium constants. 
  
  > K = (Pi/Pstand)output^(stoichiometric coefficient of i)/(Pi/Pstand)input^(stoichiometric coefficient of i) (according to the equation stoichiometry)
  > ```
  > K1 = 10266.76 * 10^6 * exp (-(26830/T) + 30.114)
  > K2 = exp((4400/T) + 4.036)
  > K3 = K1 * K2
  > ```
- > Calculate partial pressures of all components using dalton's law 
  > ```
  > Pi = yi * Pt
  > ```
- > The algorithm should generate Pt values (Total pressure)
- > Obtain K(shift) and K(reform) as equilibrium constants for water gas shift and reforming reactions respectively. Using Xu and Froment's model. (Should be expressed in terms of T (temp) preferrably)
- > The algorithm will generate values for T

STEP 4
- The algorithm solves the resulting equations for x and y (simultaneosly) for each generated solution sample and stores them. ??
- The fitness function will identify the best solutions and send them to the next generation.
