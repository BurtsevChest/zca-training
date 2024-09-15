import React from 'react';

interface IItemTemplateProps {
    weight: number;
    reps: number;
}

function ItemTemplate(props: IItemTemplateProps): React.ReactElement {
    return (
        <div
            style={{
                backgroundColor: 'var(--surface-card)',
                borderRadius: 'var(--border-radius)'
            }}
            className="flex p-4 justify-between mb-6"
        >
            <h1>{props.weight}</h1>
            <h1>{props.reps}</h1>
        </div>        
    );
}

export default ItemTemplate;
