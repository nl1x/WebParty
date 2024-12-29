import './admin-view.css';
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {PATH} from "@path/path.tsx";
import {useEffect, useState} from "react";
import {ActionProps, PendingActionProps} from "@api/objects.ts";
import {approveAction, getPendingForApprovalActions} from "@api/action.ts";
import BubbleLoader from "@components/loader/bubble-loader.tsx";
import Card from "@components/card/card.tsx";
import Button from "@components/button/button.tsx";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import {useLocation} from "react-router-dom";
import Navigation from "@components/navigation/navigation.tsx";
import HomeIcon from "@mui/icons-material/Home";

export default function AdminView()
{
  const { navigate } = useNavigatorContext();
  const [actions, setActions] = useState<PendingActionProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reloadActions, setReloadActions] = useState<boolean>(true);
  const [buttonsLoading, setButtonsLoading] = useState<Array<boolean>>([]);
  const [actionsError, setActionsError] = useState<Array<boolean>>([]);
  const location = useLocation();

  useEffect(() => {
    if (!reloadActions)
      return;

    setLoading(true);
    getPendingForApprovalActions()
      .then((response) => {
        if (response.status === 401) {
          setLoading(false);
          return navigate(PATH.NOT_FOUND);
        }
        if (response.status !== 200) {
          setLoading(false);
          return;
        }

        const timestamp = new Date().getTime();
        const updatedActions = response.data.actions.map((action: ActionProps) => ({
          ...action,
          proofPicture: `${action.proofPicture}?t=${timestamp}`
        }));
        setActions(updatedActions);
        setButtonsLoading(updatedActions.map((_: ActionProps) => false));
        setActionsError(updatedActions.map((_: ActionProps) => false));
        setReloadActions(false);
        setLoading(false);
      });
  }, [location, reloadActions]);

  const handleApproval = async (id: number, index: number, isApproved: boolean) => {
    buttonsLoading[index] = true;
    setButtonsLoading(buttonsLoading);
    const success = await approveAction(id, isApproved);

    if (!success) {
      actionsError[index] = true;
      setActionsError(actionsError);
      setTimeout(() => {
        actionsError[index] = false;
        setActionsError(actionsError);
      }, 5000);
    }

    buttonsLoading[index] = false;
    setButtonsLoading(buttonsLoading);
    setReloadActions(true);
  }

  return (
    <div className="admin-view">
      {loading
        && <BubbleLoader color="white"/>
        || (<>
        <Navigation
          text="Accueil"
          icon={<HomeIcon/>}
          redirect={PATH.HOME}
          iconButtons={[]}
        />
        {actions.length === 0 &&
          <p className="admin-view__no-action">Aucune action en attente...</p>
          ||
          <div className="admin-view__actions">
            <h1 className="admin-view__actions-title">Approbation</h1>
            <div className="admin-view__actions-list">
              {actions.map((action, i) => (
                <div key={i} id={action.id.toString()} className="admin-view__action">
                  <Card className="admin-view__action-card">
                    <div className="admin-view__action-header">
                      <div className="admin-view__action-author-profile">
                        <img className="admin-view__action-author-picture" src={action.user.avatarUrl} alt="author image"/>
                        <p>{action.user.username}</p>
                      </div>
                      <div className="admin-view__action-description">
                        <p>{action.action.description}</p>
                      </div>
                    </div>
                    <img className="admin-view__action-proof-image" src={action.proofPicture} alt="proof image"/>
                  </Card>
                  <div className="admin-view__action-controller">
                    <Button
                      key="decline"
                      text="Refuser"
                      onClick={() => handleApproval(action.id, i, false)}
                      variant="secondary"
                      icon={<CloseRoundedIcon/>}
                    />
                    <Button
                      key="approve"
                      text="Approuver" onClick={() => handleApproval(action.id, i, true)}
                      icon={<DoneRoundedIcon/>}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        </>)
      }
    </div>

  )

}
