import { dateToString } from "Controls/dateHelpers";
import { INCREASE_VALUE_PERIOD, INCREASE_VALUE_TYPE, INCREASE_VALUE_FREQUENCY, IZCAConfig } from "ZCA/interfaces";

export interface IZCAConfigDay {
    id: Date;
    sets: {
        weight: number | null;
        reps: number | null;
        sets: number | null;
    }[];
}

export interface IZCAConfigItem {
    id: number | null;
    microcycles: {
        id: number | null;
        days: IZCAConfigDay[];
    }[];
}

/**
 * Функция округляет число до ближайших 2.5 (не 149 а 150, не 133.7 а 132.5)
 * @param number 
 */
const roundToTwoFifth = (number: number) => {
    number = Math.round(number * 100) / 100;
    if (number % 2.5 === 0) {
        return number;
    } else if (number % 2.5 >= 1.25) {
        return number + (2.5 - number % 2.5);
    } else {
        return number - number % 2.5;
    }
}

/**
 * Калькулятор для расчета Жимового Цикла Алибегова
 * @author Бурцев И.А.
 */
export default class ZCACalculator {
    /**
     * Дата начала цикла
     */
    protected _dayStart: Date = new Date();
    /**
     * Разовый максимум на начало цикла
     */
    protected _weightMaximum: number | null = null;
    /**
     * Величина, на которую увеличиваем вес
     */
    protected _increaseValue: number | null = null;
    /**
     * Тип значения увеличения веса (проценты или килограммы)
     */
    protected _increaseValueType: INCREASE_VALUE_TYPE | null = null;
    /**
     * Кратность периода увелечиения веса
     */
    protected _increaseValueFrequency: INCREASE_VALUE_FREQUENCY | null = null;
    /**
     * В какой период увеличиваем вес?
     */
    protected _increaseValuePeriod: INCREASE_VALUE_PERIOD | null = null;
    /**
     * Рассчитанный цикл на основе текущих настроек калькулятора
     */
    protected _cycle: IZCAConfigItem[] = [];

    constructor (config?: IZCAConfig) {
        if (config) {
            this.update(config);
        }
    }

    /**
     * Метод пересчитывает цикл на основе измененных данных
     */
    update({
        dateStart,
        weightMaximum,
        increaseValue,
        increaseValueType,
        increaseValueFrequency,
        increaseValuePeriod
    }: IZCAConfig) {
        this._dayStart = dateStart;
        this._weightMaximum = weightMaximum;
        this._increaseValue = increaseValue;
        this._increaseValueType = increaseValueType;
        this._increaseValuePeriod = increaseValuePeriod;
        this._increaseValueFrequency = increaseValueFrequency;
        this._calculateCycle();
    }

    /**
     * Метод расчитывает цикл
     */
    private _calculateCycle () {
        if (!this._weightMaximum) {
            this._cycle = [];
            return;
        }
        let weightMaximum = this._weightMaximum;
        let dayForFill: Date = new Date(this._dayStart.getTime());

        // обновить разовый максимум при расчетах
        const updateweightMaximum = () => {
            if (this._increaseValue) {
                if (this._increaseValueType === INCREASE_VALUE_TYPE.PERCENT) {
                    weightMaximum = weightMaximum * (1 + (this._increaseValue / 100));
                } else if (this._increaseValueType === INCREASE_VALUE_TYPE.KILOGRAMM) {
                    weightMaximum = weightMaximum + this._increaseValue;
                }
            }
        };

        this._cycle = ZCA_CYCLE_CONFIG.map((mezocycle, mezocycleIndex) => {
            const cycleItem: IZCAConfigItem = {
                id: mezocycle.id,
                microcycles: []
            };
            mezocycle.microcycles.forEach((microcycle, microcycleIndex) => {
                const days: IZCAConfigDay[] = microcycle.days.map(day => {
                    const dayItem = {
                        id: new Date(dayForFill.getTime()),
                        sets: []
                    };
                    day.sets.forEach((item) => {
                        const weight = ((item.weight ?? 0) / 100) * weightMaximum;
                        const set = {
                            weight: roundToTwoFifth(weight),
                            sets: item.sets,
                            reps: item.reps
                        };
                        //@ts-ignore
                        dayItem.sets.push(set);
                    });
                    if(day.id === 2) {
                        dayForFill.setDate(dayForFill.getDate() + 3);
                    } else {
                        dayForFill.setDate(dayForFill.getDate() + 2);
                    }
                    return dayItem;
                });
                if (this._increaseValuePeriod === INCREASE_VALUE_PERIOD.MICROCYCLE) {
                    if (this._increaseValueFrequency !== null && microcycleIndex % this._increaseValueFrequency === 0) {
                        updateweightMaximum();
                    }
                }
                cycleItem.microcycles.push({
                    id: microcycle.id,
                    days: days
                });
            });
            // если обновлением веса выбран мезоцикл
            if (this._increaseValuePeriod === INCREASE_VALUE_PERIOD.MEZOCYCLE) {
                if (this._increaseValueFrequency !== null && mezocycleIndex % this._increaseValueFrequency === 0) {
                    updateweightMaximum();
                }
            }
            return cycleItem;
        });
    }

    /**
     * Метод возвращает конкретный день из конфига
     * @param date 
     */
    getZCADay(date: Date): IZCAConfigDay | undefined {
        let result: IZCAConfigDay | undefined;
        this._cycle.forEach(mezocycle => {
            mezocycle.microcycles.forEach(microcycle => {
                microcycle.days.forEach(day => {
                    if (dateToString(day.id) === dateToString(date) && !result) {
                        result = day; 
                    }
                })
            })
        });
        return result;
    }

    /**
     * Возвращает конфиг, на основе которого был построен цикл
     */
    getConfig(): IZCAConfig {
        return {
            dateStart: this._dayStart,
            weightMaximum: this._weightMaximum,
            increaseValue: this._increaseValue,
            increaseValueFrequency: this._increaseValueFrequency,
            increaseValuePeriod: this._increaseValuePeriod,
            increaseValueType: this._increaseValueType
        };
    }
}

/**
 * Интерфейс айтема подходов дня
 */
interface ISetItem {
    weight: number | null;
    reps: number | null;
    sets: number | null;
}

/**
 * Интерфейс дня микроцикла
 */
interface IZCADay {
    id: number | null;
    sets: ISetItem[];
}

/**
 * Интерфейс микроцикла
 */
interface IZCAMicrocycle {
    id: number | null;
    days: IZCADay[];
}

/**
 * Интерфейс мезоцикла
 */
interface IZCAMezoCycle {
    id: number | null;
    microcycles: IZCAMicrocycle[],
}

/**
 * Жимовой Цикл Алибегова в виде объекта с мезоциклами и микроциклами,
 * Значения весов являются процентами от ПМ 
 */
const ZCA_CYCLE_CONFIG: IZCAMezoCycle[] = [
    {
        id: 0,
        microcycles: [
            {
                id: 0,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 50,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 57.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 65,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 72.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 1,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 52.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 60,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 67.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 75,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 55,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 62.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 70,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 77.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 3,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 57.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 65,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 72.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 80,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 4,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 50,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 57.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 65,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 72.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 1,
        microcycles: [
            {
                id: 0,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 60,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 67.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 75,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 82.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 1,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 62.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 70,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 77.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 75,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 65,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 72.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 80,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 87.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 3,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 67.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 75,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 82.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 90,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 4,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 60,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 67.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 75,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 82.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        microcycles: [
            {
                id: 0,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 70,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 77.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 85,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 92.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 1,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 72.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 80,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 87.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 95,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 75,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 82.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 90,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 97.5,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 3,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 65,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 70,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 77.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 85,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        microcycles: [
            {
                id: 0,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 77.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 85,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 92.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 100,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 1,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 67.5,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 75,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 82.5,
                                reps: 5,
                                sets: 5,
                            },
                            {
                                weight: 90,
                                reps: 1,
                                sets: 2,
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                days: [
                    {
                        id: 0,
                        sets: [
                            {
                                weight: 60,
                                reps: 12,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 1,
                        sets: [
                            {
                                weight: 67.5,
                                reps: 8,
                                sets: 5,
                            }
                        ]
                    },
                    {
                        id: 2,
                        sets: [
                            {
                                weight: 100,
                                reps: 1,
                                sets: 1,
                            },
                            {
                                weight: 100,
                                reps: 1,
                                sets: 1,
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
