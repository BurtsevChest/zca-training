import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула Лэндера
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function LanderFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round(((100 * weight) / (101.3 - 2.67123 * reps)));
}
