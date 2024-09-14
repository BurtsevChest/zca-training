import React, { useState } from 'react';
import { IZCAConfig } from 'ZCA/interfaces';

export interface IZCAConfigCard {
    config: IZCAConfig;
    onSaveConfig: Function;
}

/**
 * Карточка настройки жца 
 * @returns 
 */
function Card(props: IZCAConfigCard): React.ReactElement {
    const [config, setConfig] = useState<IZCAConfig>(props.config);

    /**
     * Обработчик нажатия на кнопку "Сохранить"
     */
    const onSaveButtonClickHandler = () => {
        props.onSaveConfig(config);
    };

    /**
     * Установить значение в конфиг
     * @param date 
     */
    const setValue = (key: string, value: unknown) => {
        setConfig(config => ({...config, [key]: value}));
    };

    return (
        <>
        
        </>
    );
}

export default Card;
