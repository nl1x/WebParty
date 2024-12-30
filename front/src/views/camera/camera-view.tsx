import './camera-view.css';
import Webcam from "react-webcam";
import Card from "@components/card/card.tsx";
import IconButton from "@components/icon-button/icon-button.tsx";
import {useEffect, useRef, useState} from "react";
import Button from "@components/button/button.tsx";
import {PATH} from "@path/path.tsx";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";

import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import FlipCameraAndroidRoundedIcon from '@mui/icons-material/FlipCameraAndroidRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import {validateCurrentAction} from "@api/action.ts";
import useAuthContext from "@hooks/auth/auth-provider.tsx";
import BubbleLoader from "@components/loader/bubble-loader.tsx";

interface CameraFacingModeProps {
  exact?: "environment";
}

export default function CameraView()
{
  const { navigate } = useNavigatorContext();
  const [picture, setPicture] = useState<string | null>(null);
  const [retakePicture, setRetakePicture] = useState<boolean>(false);
  const [proofPictureUrl, setProofPictureUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const cameraRef = useRef<Webcam>(null);
  const { profile, updateUserProfile, isPendingForApproval } = useAuthContext();
  const [facingMode, setFacingMode] = useState<CameraFacingModeProps|'user'>('user');
  const [mirrored, setMirrored] = useState<boolean>(true);

  useEffect(() => {
    if (profile) {
      const timestamp = new Date().getTime();
      setProofPictureUrl(`${profile.me.action?.proofPicture}?t=${timestamp}`);
      setLoading(false);
    }
  }, [profile])

  const handleFlipCamera = () => {
    if (facingMode === 'user') {
      setFacingMode({exact: "environment"});
      setMirrored(false);
    } else {
      setFacingMode('user');
      setMirrored(true);
    }
  }

  const handleTakePicture = () => {
    const screenshot = cameraRef.current?.getScreenshot();
    if (screenshot) {
      setPicture(screenshot);
    }
  }

  const handleRetakePicture = () => {
    setPicture(null);
    setRetakePicture(true);
  }

  const handleSendPicture = async () => {
    // Send an axios post request with the picture as a file
    setLoading(true);
    await validateCurrentAction(true, picture);
    await updateUserProfile();
    setLoading(false);
    setRetakePicture(false);
    setPicture(null);
  }

  const handleNavigateBackward = () => {
    navigate(PATH.HOME);
  }

  return (
    !profile && <BubbleLoader color='white' />
    ||
    <div className="camera-view">
      <nav className="camera-view__navigation">
        <IconButton
          className="camera-view__navigate-backward"
          onClick={handleNavigateBackward}
          icon={<ArrowBackIosNewRoundedIcon/>}
        />
      </nav>
      {(retakePicture && picture || isPendingForApproval && !retakePicture) &&
        <h2 className="camera-view__validate-title">
        {(retakePicture && picture) && "Envoyer la photo ?"
          || "Photo envoyée !"
        }
        </h2>
      }
      <Card className="camera-view__card">
        {(picture || (isPendingForApproval && !retakePicture))
        && <img
           src={picture ?? proofPictureUrl}
           alt="captured"
           style={{width: '100%'}}
         />
        || <Webcam
           ref={cameraRef}
           forceScreenshotSourceSize
           videoConstraints={{width: 1600, facingMode, frameRate: 60 }}
           width='100%'
           mirrored={mirrored}
         />
        }
      </Card>
      <div
        className={"camera-view__controller" + (picture || (isPendingForApproval && !retakePicture) ? ' camera-view__validation' : '')}>
        {
          (picture || (isPendingForApproval && !retakePicture))
          && (<>
            <Button
              className="camera-view__retake-button"
              text="Reprendre"
              onClick={handleRetakePicture}
              variant="secondary"
            />
            <Button
              className="camera-view__send-button"
              text="Envoyer"
              icon={<SendRoundedIcon/>}
              iconPosition="right"
              onClick={handleSendPicture}
              disabled={(!picture) || (isPendingForApproval && !retakePicture)}
              loading={loading}
            />
          </>) || (<>
            <IconButton
              className='camera-view__flip-button'
              icon={<FlipCameraAndroidRoundedIcon style={{color: 'black'}}/>}
              onClick={handleFlipCamera}
            />
            <IconButton
              className='camera-view__capture-button'
              icon={<CameraAltRoundedIcon style={{color: 'black'}}/>}
              onClick={handleTakePicture}
            />
          </>)
        }
      </div>
    </div>
  )
}
