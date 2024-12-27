import './bubble-loader.css';

interface BubbleLoaderProps {
  color?: string;
}

export default function BubbleLoader(props: BubbleLoaderProps) {
  return (
    <div
      className="bubble-loader__lds-ellipsis"
      style={{ color: props.color ?? 'black' }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
