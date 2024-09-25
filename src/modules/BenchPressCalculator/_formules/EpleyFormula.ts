import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула Эпли
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function EpleyFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round((weight * (1 + 0.033 * reps)));
}
