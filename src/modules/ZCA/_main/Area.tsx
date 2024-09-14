import React, { useEffect, useMemo, useState } from 'react';
import { List as TrainingList } from 'ZCA/list';
import DatePicker from 'ZCA/common/DatePicker';
import { getZCAConfig } from 'ZCA/api';
import ZCACalculator, { IZCAConfigDay } from 'ZCA/common/ZCACalculator';

function Area(): React.ReactElement {
    const [zcaDay, setZcaDay] = useState<IZCAConfigDay>();
    const [date, setDate] = useState<Date>(new Date());
    const zcaCalculator = useMemo(() => new ZCACalculator(), []);

    useEffect(() => {
        getZCAConfig().then(config => {
            if (config) {
                // так что хранить, рассчитанный конфиг или цикл или и то и то
                zcaCalculator.update();
                setZcaDay(zcaCalculator.getZCADay(date));
            }
        });
    }, []);

    const onDateChanged = (date: Date) => {
        setDate(date);
    };

    return (
        <>
            <DatePicker
                date={date}
                onDateChanged={onDateChanged}
            />
            <TrainingList
                zcaDay={zcaDay}
            />
        </>
    );
}

export default Area;
