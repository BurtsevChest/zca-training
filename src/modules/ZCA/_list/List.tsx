import React from 'react';
import { IZCAConfigDay } from 'ZCA/common/ZCACalculator';
import ItemTemplate from './ItemTemplate';

interface IZCATrainingListProps {
    zcaDay?: IZCAConfigDay;
    className?: string;
}

interface ITrainingListItem {
    weight: number;
    reps: number;
}

const getListFromZCADay = (config?: IZCAConfigDay): ITrainingListItem[] => {
    const result: ITrainingListItem[] = [];
    config && config.sets.forEach(set => {
        //@ts-ignore
        for (let index = 0; index < set.sets ?? 0; index++) {
            result.push({
                weight: set.weight || 0,
                reps: set.reps || 0,
            });
        }
    });
    return result;
}

/**
 * Список подходов в ZCA по определенному дню
 * @returns 
 */
function List(props: IZCATrainingListProps): React.ReactElement {
    const list = getListFromZCADay(props.zcaDay);
    return (
        <div className={`w-full ${props.className}`}>
            {
                list && list.length ? 
                <>
                    <div className="flex justify-between pb-4 pl-2 pr-2">
                        <h1>Вес</h1>
                        <h1>Повторения</h1>
                    </div>
                    {list.map((item, index) => (
                        <ItemTemplate
                            key={index}
                            weight={item.weight}
                            reps={item.reps}
                        />
                    ))}
                </> : 
                <div className='w-full h-full flex justify-center items-center'>
                    Отдыхаем
                </div> 
            }
        </div>
    );
}

export default List;
