import './button.css';
import React from 'react';
import BubbleLoader from "@components/loader/bubble-loader.tsx";

interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'header';
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export default function Button(props: ButtonProps)
{

    const handleClick = props.disabled ? (() => {}) : props.onClick;

    return (
        <div
          onClick={handleClick}
          className={"button"
            + (' ' + props.className)
            + (' ' + (props.variant ?? ' primary'))
            + (props.disabled ? ' disabled' : '')
          }
        >
            <div className="button__icon">
              {!props.loading && props.iconPosition !== 'right' && props.icon}
            </div>
            <input
                value={props.loading ? '' : props.text}
                type='button'
                disabled={props.loading || props.disabled}
            />
            {!props.loading && props.iconPosition === 'right' && props.icon}
            {props.loading &&
              <div className='button__loader'>
                <BubbleLoader color="inherit"/>
              </div>
            }
        </div>
    )

}
