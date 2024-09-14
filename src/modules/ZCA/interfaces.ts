/**
 * Библиотека общих интерфейсов для ZCA
 * @public
 */

// вспомогательные 
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

/**
 * Типы значения увеличения веса
 */
export enum INCREASE_VALUE_TYPE {
    PERCENT = 0,
    KILOGRAMM = 1,
}

/**
 * Кратность периода увелечиения веса
 */
export type INCREASE_VALUE_FREQUENCY = IntRange<0, 3>;

/**
 * В какой период увеличиваем вес?
 */
export enum INCREASE_VALUE_PERIOD {
    MICROCYCLE = 'microcycle',
    MEZOCYCLE = 'mezocycle'
}

/**
 * Интерфейс конфига для настройки ZCA
 */
export interface IZCAConfig {
    /**
     * дата начала цикла
     */
    dateStart: Date;

    /**
     * Разовый максимум на начало цикла
     */
    weightMaximum: number;

    /**
     * Величина, на которую увеличиваем вес
     */
    increaseValue: number;

    /**
     * Тип значения (проценты или килограммы)
     */
    increaseValueType: INCREASE_VALUE_TYPE;
    
    /**
     * Кратность периода увелечиения веса
     */
    increaseValueFrequency: INCREASE_VALUE_FREQUENCY;

    /**
     * В какой период увеличиваем вес?
     */
    increaseValuePeriod: INCREASE_VALUE_PERIOD;
}
