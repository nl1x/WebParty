import './card.css';
import React, {CSSProperties} from 'react';

interface CardProps {
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
  borderSize?: number;
}

export default function Card(props: CardProps)
{

  return (
    <div className={'card ' + props.className} style={{...props.style}}>
      {props.children}
    </div>
  )
}
