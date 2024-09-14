import { IZCAConfigItem } from "ZCA/common/ZCACalculator";
import { dateToString } from "./helpers";

export const LOCAL_STORAGE_KEY = 'zca-config-key';

/**
 * Функция сериализует конфиг в JSON-строку
 */
const serializeConfig = (config: IZCAConfigItem[]): string => {
    const copyOfConfig = config.map(mezocycle => {
        return {
            id: mezocycle.id,
            microcycles: mezocycle.microcycles.map(microcycle => {
                return {
                    id: microcycle.id,
                    days: microcycle.days.map(day => {
                        const sqlDate = dateToString(day.id);
                        return {
                            id: sqlDate,
                            sets: day.sets.map(set => ({...set}))
                        }
                    })
                }
            })
        }
    });
    return JSON.stringify(copyOfConfig);
};

// делаем асинхронными на всякий случай на будущее
export const saveZCAConfig = (config: IZCAConfigItem[]): Promise<void> => {
    const data = serializeConfig(config);
    localStorage.setItem(
        LOCAL_STORAGE_KEY,
        data
    );
    return Promise.resolve();
}

export const getZCAConfig = (key: string = LOCAL_STORAGE_KEY): Promise<IZCAConfigItem[]> => {
    const data = localStorage.getItem(key);
    try {
        const result = JSON.parse(data || '');
        return Promise.resolve(result);
    } catch (e) {
        throw Promise.reject(e);
    }
}