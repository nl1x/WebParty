import './history-view.css';
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {PATH} from "@path/path.tsx";
import {useEffect, useState} from "react";
import {ActionProps} from "@api/objects.ts";
import BubbleLoader from "@components/loader/bubble-loader.tsx";
import Card from "@components/card/card.tsx";
import {useLocation} from "react-router-dom";
import Navigation from "@components/navigation/navigation.tsx";
import HomeIcon from "@mui/icons-material/Home";
import useAuthContext from "@hooks/auth/auth-provider.tsx";
import LocalFireDepartmentRoundedIcon
  from "@mui/icons-material/LocalFireDepartmentRounded";

export default function HistoryView()
{
  const { navigate } = useNavigatorContext();
  const [actions, setActions] = useState<ActionProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reloadActions, setReloadActions] = useState<boolean>(true);
  const { profile } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    if (!reloadActions) {
      return;
    }

    if (!profile) {
      navigate(PATH.LOGIN);
      return;
    }

    const timestamp = new Date().getTime();
    const updatedActions = profile.me.history.map((action: ActionProps) => ({
      ...action,
      proofPicture: `${action.proofPicture}?t=${timestamp}`
    }));
    setActions(updatedActions);
    setReloadActions(false);
    setLoading(false);
  }, [profile, location, reloadActions]);

  return (
    <div className="history-view">
      {loading
        && <BubbleLoader color="white"/>
        || (<>
        <Navigation
          text="Accueil"
          icon={<HomeIcon/>}
          redirect={PATH.HOME}
          iconButtons={[]}
        />
        <div className="history-view__actions">
          <h1 className="history-view__actions-title">Historique</h1>
          {actions.length === 0
          && <p className="history-view__no-action">Aucune action réalisée</p>
          ||
          <div className="history-view__actions-list">
            {actions.map((action, i) => (
              <div
                key={i}
                id={action.id.toString()}
                className="history-view__action"
              >
                <Card className={`history-view__action-card ${action.status}`}>
                  <div className="history-view__action-difficulty">
                    {Array(action?.action.difficulty).fill(0).map((_, index) => (
                      <LocalFireDepartmentRoundedIcon
                        fontSize="large"
                        key={index}
                        color={
                          action.action.difficulty === 2 && 'warning'
                          || action.action.difficulty === 3 && 'error'
                          || 'success'
                        }
                      />
                    ))}
                  </div>
                  <p className="history-view__action-description">{action.action.description}</p>
                  {action.action.requireProof && action.status === "done" &&
                    <img
                      className="history-view__action-proof-image"
                      src={action.proofPicture}
                      alt="proof image"
                    />
                  }
                  {action.status === 'done'
                    && <p className="history-view__action-status">Cap !</p>
                    || <p className="history-view__action-status">Pas cap...</p>
                  }
                </Card>
              </div>
            ))}
          </div>}
        </div>
        </>)}
    </div>
  )
}
