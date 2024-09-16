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
export const saveZCAConfig = (config: IZCAConfig, key: string = LOCAL_STORAGE_KEY): Promise<void> => {
    try {
        const data = serializeConfig(config);
        localStorage.setItem(
            key,
            data
        );
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
}

export const getZCAConfig = (key: string = LOCAL_STORAGE_KEY): Promise<IZCAConfig> => {
    const data = localStorage.getItem(key);
    if (!data) {
        return Promise.resolve({} as IZCAConfig);
    };
    try {
        const result = JSON.parse(data);
        result.dateStart = dateFromString(result.dateStart);
        return Promise.resolve(result);
    } catch (e) {
        return Promise.reject(e);
    }
}
