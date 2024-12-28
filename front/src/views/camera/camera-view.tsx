import './camera-view.css';
import Webcam from "react-webcam";
import Card from "@components/card/card.tsx";
import IconButton from "@components/icon-button/icon-button.tsx";
import {useRef, useState} from "react";

import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import FlipCameraAndroidRoundedIcon from '@mui/icons-material/FlipCameraAndroidRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

export default function CameraView()
{
  const cameraRef = useRef<Webcam>(null);
  const [picture, setPicture] = useState<string | null>(null);

  const handleFlipCamera = () => {
    console.log("flip camera");
  }

  const handleTakePicture = () => {
    const screenshot = cameraRef.current?.getScreenshot();
    if (screenshot) {
      setPicture(screenshot);
    }
  }

  const handleRetakePicture = () => {
    setPicture(null);
  }

  return (
    <div className="camera-view">
      <Card className="camera-view__card">
        {picture
          && <img src={picture} alt="captured" />
          || <Webcam ref={cameraRef} height='100%' mirrored={true}/>
        }
      </Card>
      <div className="camera-view__controller">
        <IconButton
          className='camera-view__flip-button'
          icon={
            picture
            && <RestartAltRoundedIcon style={{ color: 'black' }} />
            || <FlipCameraAndroidRoundedIcon style={{ color: 'black' }} />
          }
          onClick={
            picture
            && handleRetakePicture
            || handleFlipCamera
          }
        />
        <IconButton
          className='camera-view__capture-button'
          icon={
            <CameraAltRoundedIcon style={{ color: 'black' }} />
          }
          onClick={
            handleTakePicture
          }
        />
      </div>
    </div>
  )
}
