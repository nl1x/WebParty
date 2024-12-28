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
import IconButton from "@components/icon-button/icon-button.tsx";
import {PATH} from "@path/path.tsx";
import {validateCurrentAction} from "@api/action.ts";
import useAuthContext from "@hooks/auth/auth-provider.tsx";

export default function HomeView()
{
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAction, setHasAction] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [difficultyColor, setDifficultyColor] = useState<'success'|'warning'|'error'>('success');
  const [isPendingForApproval, setIsPendingForApproval] = useState<boolean>(true);
  const { navigate } = useNavigatorContext();
  const { profile, updateUserProfile } = useAuthContext();

  useEffect(() => {
    updateUserProfile()
      .then((success) => {
        if (!success)
          return navigate(PATH.LOGIN);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (profile) {
      setHasAction(profile.me.action !== null);
      setIsPendingForApproval(profile.me.action?.status === 'pending-approval');

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

      setLoading(false);
    }
  }, [profile]);

  const handleRankButton = () => {
    navigate('/rank');
  }

  const handleHistoryButton = () => {
    navigate('/history');
  }

  const handleAbleButton = async () => {
    if (profile?.me.action?.action.requireProof) {
      navigate(PATH.CAMERA);
      return;
    }

    const isValidated = validateCurrentAction(true);

    if (!isValidated) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    await updateUserProfile();
  }

  const handleNotAbleButton = async () => {
    const isValidated = await validateCurrentAction(false);

    if (!isValidated) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    await updateUserProfile();
  }

  return (
    loading && <BubbleLoader color='white' />
    ||
    <div className="home-view">
      <nav className="home-view__navigation">
        <Button
          className="home-view__navigation__rank-button"
          text="Classement"
          onClick={handleRankButton}
          variant="header"
          icon={<MilitaryTechRoundedIcon className="home-view__navigation__rank-button-icon" />}
        />
        <IconButton
          className="home-view__navigation__history-button"
          onClick={handleHistoryButton}
          icon={<ChecklistRoundedIcon/>}
        />
      </nav>
      <div className="home-view__title">
        <h1>Nouvel an 2025 🎉</h1>
        <h4>{profile?.me?.username}</h4>
      </div>
        <Card className={"home-view__action-card " + (error ? 'home-view__action-card-error' : '')}>
          <div className="home-view__action-difficulty">
          {hasAction &&
            Array(profile?.me.action?.action.difficulty).fill(0).map((_, index) => (
              <LocalFireDepartmentRoundedIcon fontSize="large" key={index} color={difficultyColor}/>
            ))
          }
          </div>
          <p>{hasAction
            && profile?.me.action?.action.description
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
            disabled={isPendingForApproval || !hasAction}
          />
          <Button
            className="home-view__validate-button"
            onClick={handleAbleButton}
            text={"Cap !"}
            icon={profile?.me?.action?.action?.requireProof
              ? <CameraAltRoundedIcon/>
              : <SentimentVerySatisfiedRoundedIcon/>
            }
            disabled={isPendingForApproval || !hasAction}
          />
        </div>
      </div>
  )
}
