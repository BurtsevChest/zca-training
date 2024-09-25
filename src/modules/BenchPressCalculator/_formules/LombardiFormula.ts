import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула Ломбарди
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function LombardiFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round((weight * Math.pow(reps, 0.1)));
}
