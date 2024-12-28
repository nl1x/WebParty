import './text-input.css';
import React from "react";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
  onClick: () => void;
  onPressEnter?: () => void;
  password?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "error";
  disabled?: boolean;
}

export default function TextInput(props: TextInputProps)
{

  const onSubmit = props.onPressEnter ?? (() => {});

  return (
    <div
      className={props.className + " text-input text-input__variant-" + props.variant
        + (props.disabled ? " text-input__disabled" : '')}
      onClick={props.onClick}
    >
      {props.leftIcon &&
        <div className="text-input__icon">
          {props.leftIcon}
        </div>
      }
      <input
        className={
          props.leftIcon ? "text-input__has-left-icon" : ""
          + props.rightIcon ? "text-input__has-right-icon" : ""
        }
        placeholder={props.placeholder}
        value={props.value}
        onChange={
          (event) => props.onChange(event.target.value)
        }
        onSubmit={() => onSubmit()}
        type={props.password ? 'password' : 'text'}
        disabled={props.disabled}
      />
      {props.rightIcon &&
        <div className="text-input__icon">
          {props.rightIcon}
        </div>
      }
    </div>
  )

}
