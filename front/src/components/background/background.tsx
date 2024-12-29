import './background.css';
import { ReactNode } from "react";

interface BackgroundProps {
    children: ReactNode
}

export default function Background(props: BackgroundProps)
{
    return (
        <div className="background">
            {props.children}
            <div className="background-circles">
                <div className="circle blue"></div>
                <div className="circle red"></div>
                <div className="circle yellow"></div>
            </div>
        </div>
    )
}
