import { SidebarOpener } from "react-modal-opener";

export const sidebarOpener = new SidebarOpener();

sidebarOpener.defaultStyles = {
    ...sidebarOpener.defaultStyles,
    maxWidth: '100%',
    minWidth: 0,
    minHeight: 0,
    width: '500px',
    backgroundColor: 'var(--surface-card)',
};
