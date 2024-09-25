import { IFormulaFunctionOptions } from "BenchPressCalculator/interfaces";

/**
 * Формула Ватана
 * @param weight вес штанги
 * @param reps повторения
 * @returns 
 */
export default function VatanFormula({ weight, reps }: IFormulaFunctionOptions): number  {
    return Math.round(((weight * 100) / (48.8 + 53.8 * Math.pow(Math.E, -0.075 * reps))));
}
