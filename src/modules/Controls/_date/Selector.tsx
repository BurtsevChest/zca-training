import React from 'react';
import { Calendar, CalendarDateTemplateEvent } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { isTouchDevice } from 'Controls/helpers';

export interface IDateSelector {
    date: Date;
    onDateChanged?: (date: Nullable<Date>) => void;
    dateTemplate?: (date: CalendarDateTemplateEvent) => React.ReactNode;
}

/**
 * Общий компонент выбора даты
 * @returns 
 */
function DateSelector(props: IDateSelector): React.ReactElement {
    return (
        <Calendar
            value={props.date}
            dateFormat='dd/mm/yy'
            onChange={(e) => props.onDateChanged?.(e.value)}
            touchUI={isTouchDevice()}
            locale='ru'
            dateTemplate={props.dateTemplate}
        />
    );
}

export default DateSelector;
