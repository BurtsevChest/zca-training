import React, { useState } from 'react';
import { INCREASE_VALUE_PERIOD, INCREASE_VALUE_TYPE, IZCAConfig } from 'ZCA/interfaces';
import { SidebarTemplate } from 'Controls/sidebar';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { isTouchDevice } from 'Controls/helpers';
import { SidebarOpener } from 'react-modal-opener';
import './styles.less';
import { Nullable } from 'primereact/ts-helpers';

export interface IZCAConfigCard {
    id: number;
    config: IZCAConfig;
    onSaveConfig: (config: IZCAConfig) => void;
}

const DEAFULT_SETTINGS: IZCAConfig = {
    dateStart: new Date(),
    weightMaximum: null,
    increaseValue: null,
    increaseValueType: null,
    increaseValueFrequency: null,
    increaseValuePeriod: null
};

/**
 * Карточка настройки жца 
 * @returns 
 */
function Card(props: IZCAConfigCard): React.ReactElement {
    const [config, setConfig] = useState<IZCAConfig>({
        ...DEAFULT_SETTINGS,
        ...props.config,
        dateStart: props.config.dateStart || new Date() 
    });
    const [weightMaximumValid, setWeightMaximumValid] = useState(true);

    /**
     * Обработчик нажатия на кнопку "Сохранить"
     */
    const onSaveButtonClickHandler = () => {
        if (!config.weightMaximum) {
            setWeightMaximumValid(false);
        } else {
            props.onSaveConfig(config);
            SidebarOpener.sidebarClose(props.id);
        }
    };

    /**
     * Установить значение в конфиг
     * @param date 
     */
    const setValue = (key: string, value: unknown) => {
        setConfig(config => ({...config, [key]: value ?? null}));
    };

    const increaseValueTypeSource = [
        { label: 'Килограммы', value: INCREASE_VALUE_TYPE.KILOGRAMM },
        { label: 'Проценты', value: INCREASE_VALUE_TYPE.PERCENT },
    ];

    const increaseValueFrequencySource = [
        { label: '1', value: 1},
        { label: '2', value: 2 },
        { label: '3', value: 3 },
    ];

    const increaseValuePeriodSource = [
        { label: 'Мезоцикл', value: INCREASE_VALUE_PERIOD.MEZOCYCLE },
        { label: 'Микроцикл(неделя)', value: INCREASE_VALUE_PERIOD.MICROCYCLE },
    ];

    const onWeightMaximumChanged = (value: Nullable<number | null>) => {
        setWeightMaximumValid(true);
        setValue('weightMaximum', value);
    }

    return (
        <SidebarTemplate
            id={props.id}
        >
            <div className="h-full flex flex-col relative">
                <div className="flex items-start mb-4 ZCA-SettingsCard-body-header">
                    <h1>Настройка ЖЦА</h1>
                    <Button
                        className='ml-auto mr-16 ZCA-SettingsCard-saveButton'
                        icon='pi pi-check'
                        label='Сохранить'
                        rounded
                        size='small'
                        onClick={onSaveButtonClickHandler}
                    />
                </div>
                <div className="overflow-y-auto flex-grow ZCA-SettingsCard-body-scroll">
                    <div className="pb-6">
                        <h2 className='pb-2'>Дата начала цикла</h2>
                        <Calendar
                            value={config.dateStart}
                            dateFormat="dd/mm/yy"
                            onChange={e => setValue('dateStart', e.value)}
                            touchUI={isTouchDevice()}
                            locale='ru'
                        />
                    </div>
                    <div className="pb-6">
                        <h2 className='pb-2'>Разовый максимум на начало цикла, кг</h2>
                        <InputNumber
                            value={config.weightMaximum}
                            maxLength={3}
                            invalid={!weightMaximumValid}
                            onValueChange={e => onWeightMaximumChanged(e.value)}
                        />
                        {!weightMaximumValid && <Message className='w-full' severity="error" text="Поле обязательно для заполнения" /> }
                    </div>
                    <div className="pb-6">
                        <h2 className='pb-2'>Величина, на которую увеличиваем вес</h2>
                        <InputNumber
                            value={config.increaseValue}
                            maxLength={5}
                            minFractionDigits={2}
                            maxFractionDigits={2}
                            onValueChange={e => setValue('increaseValue', e.value)}
                        />
                    </div>
                    <div className="pb-6">
                        <h2 className='pb-2'>Тип значения увеличения веса</h2>
                        <Dropdown
                            showClear 
                            value={config.increaseValueType}
                            options={increaseValueTypeSource}
                            onChange={e => setValue('increaseValueType', e.value)}
                        />
                    </div>
                    <div className="pb-6">
                        <h2 className='pb-2'>В какой период увеличиваем вес?</h2>
                        <Dropdown
                            showClear 
                            value={config.increaseValuePeriod}
                            options={increaseValuePeriodSource}
                            onChange={e => setValue('increaseValuePeriod', e.value)}
                        />
                    </div>
                    <div className="pb-6">
                        <h2 className='pb-2'>Кратность периода увелечиения веса</h2>
                        <Dropdown
                            showClear 
                            value={config.increaseValueFrequency}
                            options={increaseValueFrequencySource}
                            onChange={e => setValue('increaseValueFrequency', e.value)}
                        />
                    </div>
                </div>
            </div>
        </SidebarTemplate>
    );
}

export default Card;
