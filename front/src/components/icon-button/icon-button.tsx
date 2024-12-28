import './icon-button.css';
import React from 'react';

interface IconButtonProps {
    onClick: () => void;
    className?: string;
    icon: React.ReactNode;
}

export default function IconButton(props: IconButtonProps)
{

    return (
        <div onClick={props.onClick} className={props.className + " icon-button"}>
            {props.icon}
        </div>
    )

}
