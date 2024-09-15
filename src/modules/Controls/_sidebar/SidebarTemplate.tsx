import { Button } from 'primereact/button';
import React from 'react';
import { SidebarOpener } from 'react-modal-opener';
import './styles.less'

export interface ISidebarTemplate {
    id: number;
    onSidebarClose?: () => Promise<boolean>;
    children: React.ReactElement;
    closeBtnPosition?: 'right' | 'left',
    duration?: number;
}

function SidebarTemplate(props: ISidebarTemplate): React.ReactElement {
    const onSidebarClose = async () => {
        if (props.onSidebarClose) {
            const result = await props.onSidebarClose();
            if (result) {
                SidebarOpener.sidebarClose(props.id);
            }
        } else {
            SidebarOpener.sidebarClose(props.id);
        }
    };

    const onKeyDownHandler = (event: KeyboardEvent) => {
        const escPressed = event.key === 'Escape';
        if (escPressed) {
            onSidebarClose();
        }
    } 

    return (
        //@ts-ignore
        <div onKeyDown={onKeyDownHandler} className='p-4 h-full'>
            <div className="SidebarTemplate-body h-full">
                <Button
                    className={`SidebarTemplate-closeBtn SidebarTemplate-closeBtn-${props.closeBtnPosition === 'left' ? 'left' : 'right'}`}
                    icon='pi pi-times'
                    outlined
                    onClick={onSidebarClose}
                />
                {props.children}
            </div>
        </div>
    );
}

export default SidebarTemplate;
