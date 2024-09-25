/**
 * Набор вспомогательных интерфейсов для калькулятора разового максимума в жиме лежа
 * @public
 */

import { IntRange } from "ZCA/interfaces";

/**
 * Интерфейс опций формулы расчета
 */
export interface IFormulaFunctionOptions {
    /**
     * Вес штанги
     */
    weight: number;
    /**
     * Количество повторений с этим весом
     */
    reps: number;
}

export type TWeightRange = IntRange<10, 350>;

export type TRepsRange = IntRange<2, 20>;
