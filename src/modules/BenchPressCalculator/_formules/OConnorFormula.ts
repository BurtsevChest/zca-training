import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула О'Коннора
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function OConnorFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round((weight * (1 + 0.025 * reps)));
}
