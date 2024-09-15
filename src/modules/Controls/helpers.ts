/**
 * хелпер для определения touch-устройства у пользователя. Вызывать только на клиенте!!!!
 * @returns
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
