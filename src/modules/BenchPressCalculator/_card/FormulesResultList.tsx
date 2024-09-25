import { BrzyckiFormula, EpleyFormula, LanderFormula, LombardiFormula, MayhewFormula, OConnorFormula, VatanFormula } from 'BenchPressCalculator/formules';
import { IFormulaFunctionOptions } from 'BenchPressCalculator/interfaces';
import React from 'react';

interface IItemTemplate {
    name: string;
    weightMaximum: number;
}

const ItemTemplate = ({
    name,
    weightMaximum
}: IItemTemplate) => {
    return (
        <div className="w-full">
            <div className="flex justify-between">
                <div>{name}</div>
                <div>{weightMaximum}</div>
            </div>
        </div>
    );
}

const calcAverageWeight = (weights: number[]) => {
    return Math.round(weights.reduce((a, b) => (a + b)) / weights.length);
}

type TFormulesResultList = IFormulaFunctionOptions 

function FormulesResultList({ weight, reps }: TFormulesResultList): React.ReactElement {
    const epleyValue = EpleyFormula({ weight, reps });
    const brzyckiValue = BrzyckiFormula({ weight, reps });
    const landerValue = LanderFormula({ weight, reps });
    const lombardiValue = LombardiFormula({ weight, reps });
    const mayhewValue = MayhewFormula({ weight, reps });
    const oConnorValue = OConnorFormula({ weight, reps });
    const vatanValue = VatanFormula({ weight, reps });
    const averageValue = calcAverageWeight([
        epleyValue,
        brzyckiValue,
        landerValue,
        lombardiValue,
        mayhewValue,
        oConnorValue,
        vatanValue
    ]);

    return (
        <div className="w-full h-auto">
            <div className="mb-6">
                <ItemTemplate
                    name='Среднее значение'
                    weightMaximum={averageValue}
                />
            </div>
            <div className="mb-6">
                <ItemTemplate
                    name='Формула Эпли'
                    weightMaximum={epleyValue}
                />
            </div>
            <div className="mb-6">
                <ItemTemplate
                    name='Формула Бжицки'
                    weightMaximum={brzyckiValue}
                />
            </div>
            <div className="mb-6">
                <ItemTemplate
                    name='Формула Лэндера'
                    weightMaximum={landerValue}
                />
            </div>
            <div className="mb-6">
                <ItemTemplate
                    name='Формула Ломбарди'
                    weightMaximum={lombardiValue}
                />
            </div>
            <div className="mb-6">
                <ItemTemplate
                    name='Формула Мэйхью'
                    weightMaximum={mayhewValue}
                />
            </div>
            <div className="mb-6">
                <ItemTemplate
                    name="Формула О'Коннор"
                    weightMaximum={oConnorValue}
                />
            </div>
            <div>
                <ItemTemplate
                    name='Формула Ватана'
                    weightMaximum={vatanValue}
                />
            </div>
        </div>
    );
}

export default React.memo(FormulesResultList);
