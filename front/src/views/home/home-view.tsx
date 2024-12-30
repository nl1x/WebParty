import './home-view.css';
import BubbleLoader from "@components/loader/bubble-loader.tsx";
import {useEffect, useState} from "react";
import Card from "@components/card/card.tsx";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import Button from "@components/button/button.tsx";

import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

import {PATH} from "@path/path.tsx";
import {validateCurrentAction} from "@api/action.ts";
import useAuthContext from "@hooks/auth/auth-provider.tsx";
import Navigation, {
  NavigationIconButtonsProps
} from "@components/navigation/navigation.tsx";

export default function HomeView()
{
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [difficultyColor, setDifficultyColor] = useState<'success'|'warning'|'error'>('success');
  const { navigate } = useNavigatorContext();
  const { profile, isPendingForApproval, hasAction, updateUserProfile } = useAuthContext();

  useEffect(() => {
    if (profile) {
      if (hasAction) {
        switch (profile.me.action?.action.difficulty) {
          case 2:
            setDifficultyColor('warning');
            break;
          case 3:
            setDifficultyColor('error');
            break;
          default:
            setDifficultyColor('success');
            break;
        }
      }

      setLoading(false);
    }
  }, [profile]);

  const handleAbleSeeButton = async () => {
    if (profile?.me.action?.action.requireProof) {
      navigate(PATH.CAMERA);
      return;
    }

    setButtonLoading(true);
    const isValidated = await validateCurrentAction(true);

    if (!isValidated) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    await updateUserProfile();
    setButtonLoading(false);
  }

  const handleNotAbleButton = async () => {
    setButtonLoading(true);
    console.log("validating action");
    const isValidated = await validateCurrentAction(false);

    if (!isValidated) {
      setError(true);
      setButtonLoading(false);
      setTimeout(() => setError(false), 3000);
      return;
    }

    console.log("updating profile");
    await updateUserProfile();
    setButtonLoading(false);
  }

  const navigationIconButtons: NavigationIconButtonsProps[] = [
    {
      icon: <ChecklistRoundedIcon/>,
      redirect: PATH.HISTORY
    }
  ];

  if (profile && profile.me.role.weight > 0) {
    navigationIconButtons.push({
      icon: <AdminPanelSettingsRoundedIcon/>,
      redirect: PATH.ADMIN
    });
  }

  return (
    loading && <BubbleLoader color='white' />
    ||
    <div className="home-view">
      <Navigation
        text="Classement"
        icon={<MilitaryTechRoundedIcon />}
        redirect={PATH.RANK}
        iconButtons={navigationIconButtons.reverse()}
      />
      <div className="home-view__title">
        <h1>Nouvel an 2025 🎉</h1>
        <h4>{profile?.me?.displayName ?? profile?.me?.username}</h4>
      </div>
      <Card className={"home-view__action-card " + (error ? 'home-view__action-card-error' : '')}>
        <div className="home-view__action-difficulty">
        {(profile?.me?.action) &&
          Array(profile?.me.action?.action.difficulty).fill(0).map((_, index) => (
            <LocalFireDepartmentRoundedIcon fontSize="large" key={index} color={difficultyColor}/>
          ))
        }
        </div>
        <p>{hasAction && profile?.me.action?.action.description
          || "Félicitation ! Tu as terminé toutes tes actions ! 🥳"
        }</p>
        {isPendingForApproval &&
          <p className="home-view__action-status">En attente d'approbation...</p>
        }
      </Card>
      <div className="home-view__cta-buttons">
        <Button
          variant="secondary"
          className="home-view__validate-button"
          onClick={handleNotAbleButton}
          text={"Pas cap..."}
          icon={<SentimentVeryDissatisfiedRoundedIcon/>}
          loading={buttonLoading}
          disabled={isPendingForApproval || !(profile?.me?.action)}
        />
        <Button
          className="home-view__validate-button"
          onClick={handleAbleSeeButton}
          text={isPendingForApproval && "Voir" || "Cap !"}
          icon={profile?.me?.action?.action?.requireProof
            ? (isPendingForApproval
              && <RemoveRedEyeRoundedIcon/>
              || <CameraAltRoundedIcon/>)
            : <SentimentVerySatisfiedRoundedIcon/>
          }
          loading={buttonLoading}
          disabled={!(profile?.me?.action)}
        />
      </div>
    </div>
  )
}
