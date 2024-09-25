import React, { useEffect, useMemo, useState } from 'react';
import { List as TrainingList } from 'ZCA/list';
import { getZCAConfig, saveZCAConfig } from 'ZCA/api';
import ZCACalculator, { IZCAConfigDay } from 'ZCA/common/ZCACalculator';
import { IZCAConfigCard } from 'ZCA/_settings/Card';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { sidebarOpener } from 'Controls/sidebar';
import { DateSelector } from 'Controls/date';
import { CalendarDateTemplateEvent } from 'primereact/calendar';
import './styles.less';
import { Nullable } from 'primereact/ts-helpers';

function Area(): React.ReactElement {
    const [zcaDay, setZcaDay] = useState<IZCAConfigDay>();
    const [date, setDate] = useState<Date>(new Date());
    const [configWeightMaximum, setConfigWeightMaximum] = useState<number | null>(null);
    const zcaCalculator = useMemo(() => new ZCACalculator({
        dateStart: date,
        increaseValue: null,
        increaseValueFrequency: null,
        increaseValuePeriod: null,
        increaseValueType: null,
        weightMaximum: null,
    }), []);

    const setZCADayByConfig = (date: Date) => {
        setZcaDay(zcaCalculator.getZCADay(date));
    }

    useEffect(() => {
        getZCAConfig().then(config => {
            if (config) {
                zcaCalculator.update(config);
                setConfigWeightMaximum(zcaCalculator.getConfig().weightMaximum);
            }
            setZCADayByConfig(date);
        });
    }, []);

    /**
     * Обработчик на смену даты в селекторе
     * @param date 
     */
    const onDateChanged = (date: Nullable<Date>) => {
        if (date) {
            setDate(date);
            setZCADayByConfig(date);
        }
    };

    /**
     * Открыть карточку настроек ЖЦА
     */
    const openZCASettings = () => {
        sidebarOpener.open({
            name: 'zcaSettings',
            Component: () => import('ZCA/_settings/Card'),
            props: {
                config: zcaCalculator.getConfig(),
                onSaveConfig: (config) => {
                    zcaCalculator.update(config);
                    setConfigWeightMaximum(zcaCalculator.getConfig().weightMaximum);
                    setZCADayByConfig(date);
                    saveZCAConfig(config);
                },
            } as IZCAConfigCard
        });
    };

    /**
     * Шаблон даты селектора дат
     * @param date 
     * @returns 
     */
    const dateTemplate = (date: CalendarDateTemplateEvent) => {
        const dateFrom = new Date(date.year, date.month, date.day);
        const zcaDay = zcaCalculator.getZCADay(dateFrom);

        if (zcaDay) {
            return (<div className='ZCA-Area-dateTemplate'>{date.day}</div>)
        }
        return date.day;
    }

    /**
     * Открыть карточку рассчета максимума в жиме лежа
     */
    const openBenchPressCalculator = () => {
        sidebarOpener.open({
            name: 'benchPressCalculator',
            Component: () => import('BenchPressCalculator/_card/Card'),
            position: 'left'
        });
    }

    return (
        <div className='zca-container'>
            <div className="flex flex-col pt-5 pb-5 items-center h-full">
                <Toolbar
                    className='w-full flex-nowrap mb-4'
                    start={
                        <Button
                            onClick={openBenchPressCalculator}
                            rounded
                            label='Max'
                        />
                    }
                    center={
                        <DateSelector
                            date={date}
                            onDateChanged={onDateChanged}
                            dateTemplate={dateTemplate}
                        />
                    }
                    end={
                        <Button onClick={openZCASettings} icon="pi pi-cog" outlined/>
                    }
                />
                {
                    configWeightMaximum ? 
                    <TrainingList
                        zcaDay={zcaDay}
                        className='h-full overflow-auto'
                    /> :
                    <div className='pt-4 h-full flex items-center justify-center'>
                        <div>Цикл не настроен</div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Area;
