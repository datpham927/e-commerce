/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface OverlayProps {
    className?: string;
    onClick?: ((e: any) => void | Promise<void> | React.MouseEvent<HTMLButtonElement, MouseEvent>) | undefined;
    children?: React.ReactNode;
}
const Overlay: React.FC<OverlayProps> = ({ className, onClick, children }) => {
    const hasChildrenStyle = 'flex items-center justify-center';
    return (
        <div
            className={`fixed w-screen h-screen   right-0 top-0 bg-overlay ${className ? className : ''} ${children ? hasChildrenStyle : ''} `}
            onClick={onClick}>
            {children}
        </div>
    );
};

export default Overlay;
