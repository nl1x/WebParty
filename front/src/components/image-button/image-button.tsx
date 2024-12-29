import './image-button.css';

interface ImageButtonProps {
    onClick: () => void;
    className?: string;
    imageUrl: string;
}

export default function ImageButton(props: ImageButtonProps)
{
    return (
        <div onClick={props.onClick} className={props.className + " image-button"}>
            <img className="image-button__image" src={props.imageUrl} alt=""/>
        </div>
    );
}
