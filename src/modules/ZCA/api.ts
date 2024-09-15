import { IZCAConfig } from "ZCA/interfaces";
import { dateFromString, dateToString } from "Controls/dateHelpers";

export const LOCAL_STORAGE_KEY = 'zca-config-key';

/**
 * Функция сериализует конфиг в JSON-строку
 */
const serializeConfig = (config: IZCAConfig): string => {
    const copyOfConfig = {
        ...config,
        dateStart: dateToString(config.dateStart)
    }
    return JSON.stringify(copyOfConfig);
};

// делаем асинхронными на всякий случай на будущее
export const saveZCAConfig = (config: IZCAConfig): Promise<void> => {
    const data = serializeConfig(config);
    localStorage.setItem(
        LOCAL_STORAGE_KEY,
        data
    );
    return Promise.resolve();
}

export const getZCAConfig = (key: string = LOCAL_STORAGE_KEY): Promise<IZCAConfig> => {
    const data = localStorage.getItem(key);
    if (!data) {
        return Promise.resolve({})
    };
    try {
        const result = JSON.parse(data || '');
        result.dateStart = dateFromString(result.dateStart);
        return Promise.resolve(result);
    } catch (e) {
        throw Promise.reject(e);
    }
}
