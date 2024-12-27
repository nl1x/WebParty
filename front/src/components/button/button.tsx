import './button.css';
import BubbleLoader from "@components/loader/bubble-loader.tsx";

interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    className?: string;
    loading?: boolean;
}

export default function Button(props: ButtonProps)
{

    return (
        <div className={props.className + " button " + (props.variant ?? 'primary')}>
            <input
                value={props.loading ? '' : props.text}
                onClick={
                    () => props.onClick()
                }
                type='button'
                disabled={props.loading}
            />
            {props.loading &&
              <div className='button__loader'>
                <BubbleLoader/>
              </div>
            }
        </div>
    )

}
