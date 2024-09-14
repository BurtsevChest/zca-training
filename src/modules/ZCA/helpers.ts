/**
 * Библиотека хелперов для ЖЦА
 */

/**
 * Метод возвращает строку даты в виде YYYY-MM-DD 
 * @param date 
 * @param startmonth взять день из начала месяца
 */
export const dateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
};
