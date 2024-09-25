import { SidebarTemplate } from 'Controls/sidebar';
import React, { useState } from 'react';
import './styles.less';
import { TRepsRange, TWeightRange } from 'BenchPressCalculator/interfaces';
import { InputNumber } from 'primereact/inputnumber';
import FormulesResultList from './FormulesResultList';
import { Nullable } from 'primereact/ts-helpers';

interface IBenchPressCalcCard {
    id: number;
}

/**
 * Карточка калькулятора разового максимума в жиме лежа
 * @returns 
 */
function Card(props: IBenchPressCalcCard): React.ReactElement {
    const [weight, setWeight] = useState<TWeightRange>(10);
    const [reps, setReps] = useState<TRepsRange>(2);

    return (
        <SidebarTemplate
            id={props.id}
        >
            <div className='h-full flex flex-col relative BenchPressCalcCard-header'>
                <div className="flex items-start mb-4 pr-14">
                    <h1>Калькулятор расчета разового максимума в жиме лежа</h1>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <div className="pb-6">
                        <h2 className='pb-2'>Вес штанги, кг</h2>
                        <InputNumber
                            value={weight}
                            min={1}
                            max={350}
                            // @ts-ignore
                            onValueChange={e => setWeight(e.value)}
                        />
                    </div>
                    <div className="pb-6">
                        <h2 className='pb-2'>Количество повторений</h2>
                        <InputNumber
                            value={reps}
                            min={2}
                            max={20}
                            // @ts-ignore
                            onValueChange={e => setReps(e.value)}
                        />
                    </div>
                    <FormulesResultList
                        weight={weight}
                        reps={reps}
                    />
                </div>
            </div>
        </SidebarTemplate>
    );
}

export default Card;
