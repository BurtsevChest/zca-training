import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула Мэйхью
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function MayhewFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round((100 * weight) / (52.2 + 41.9 * Math.pow(Math.E, -0.055 * reps)));
}
