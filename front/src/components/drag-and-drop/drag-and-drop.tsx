import './drag-and-drop.css';
import {useEffect, useState} from "react";

enum ComponentState {
    DROPPING='drag-and-drop__dropping',
    DROPPED='drag-and-drop__dropped',
    EMPTY='drag-and-drop__empty'
}

interface FileSelectionProps {
    componentState: ComponentState;
    setComponentState: (value: ComponentState) => void;
    imageSrc: string|null;
    setImageSrc: (value: string) => void;
    selectedFile: File;
}
function handleFileSelection(props: FileSelectionProps) {
    props.setComponentState(ComponentState.DROPPED);
    if (props.selectedFile && props.selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            props.setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(props.selectedFile);
    }
}

export interface DragAndDropSettings {
    file: File|null;
    setFile: (value: File|null) => void;
}

export function useDragAndDropSettings() : DragAndDropSettings {
    const [file, setFile] = useState<File|null>(null);

    return {
        file, setFile
    };
}

interface DragAndDropProps {
    fileSettings: DragAndDropSettings;
    defaultImage?: string;
    className?: string;
}
export default function DragAndDrop(props: DragAndDropProps) {
    const [componentState, setComponentState] = useState(ComponentState.EMPTY);
    const [imageSrc, setImageSrc] = useState<string>(props.defaultImage ?? "");
    const id = `drag-and-drop__input-${Math.random() * 100000}`;

    useEffect(() => {
      if (props.defaultImage)
        setImageSrc(props.defaultImage);
    }, [props.defaultImage])

    return (
        <>
            <div
                className={`drag-and-drop-component ${props.className} ${componentState}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setComponentState(ComponentState.DROPPING);
                }}
                onDragLeave={(_) => {
                    setComponentState(ComponentState.EMPTY);
                }}
                onChange={(e: any) => {
                    const selectedFile = e.target.files?.[0];
                    handleFileSelection({componentState, imageSrc, selectedFile, setComponentState, setImageSrc});
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files[0];
                    handleFileSelection({componentState, imageSrc, selectedFile: droppedFile, setComponentState, setImageSrc});
                }}
                onClick={() => {
                    document.getElementById(id)?.click()
                }}
            >

                <img className='drag-and-drop__placeholder' src={imageSrc} alt='drag-and-drop file' />
                <input
                    type="file"
                    id={id}
                    style={{display: 'none'}} // Cache le champ input
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];

                        if (!selectedFile)
                            return;

                        handleFileSelection({componentState, imageSrc, selectedFile, setComponentState, setImageSrc});
                        props.fileSettings.setFile(selectedFile);
                    }}
                />
            </div>

        </>
    )

}
