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
}

export default function Button(props: ButtonProps)
{

    return (
        <div
          onClick={() => props.onClick()}
          className={"button"
            + (' ' + props.className)
            + (' ' + (props.variant ?? ' primary'))
            + (props.disabled ? ' disabled' : '')
          }
        >
            {props.icon}
            <input
                value={props.loading ? '' : props.text}
                type='button'
                disabled={props.loading || props.disabled}
            />
            {props.loading &&
              <div className='button__loader'>
                <BubbleLoader color="inherit"/>
              </div>
            }
        </div>
    )

}
