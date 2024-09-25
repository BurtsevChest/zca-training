import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула Бжицки
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function BrzyckiFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round(((weight * 36) / (37 - reps)));
}
