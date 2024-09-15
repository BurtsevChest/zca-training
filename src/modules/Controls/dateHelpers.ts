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

/**
 * Возвращает дату из строки вида YYYY-MM-DD
 * @param string 
 */
export const dateFromString = (string: string) => {
    const dateValues = string.split('-');
    return new Date(dateValues[0], dateValues[1] - 1, dateValues[2]);
}
