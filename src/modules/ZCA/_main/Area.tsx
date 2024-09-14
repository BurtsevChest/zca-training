import React from 'react';
import { List as TrainingList } from 'ZCA/list';
import DatePicker from 'ZCA/common/DatePicker';

function Area(): React.ReactElement {
    return (
        <>
            <DatePicker/>
            <TrainingList/>
        </>
    );
}

export default Area;
