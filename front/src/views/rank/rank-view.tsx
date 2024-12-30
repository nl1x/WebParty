import './rank-view.css';
import Navigation, {
  NavigationIconButtonsProps
} from "@components/navigation/navigation.tsx";
import {Home} from "@mui/icons-material";
import {PATH} from "@path/path.tsx";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import AdminPanelSettingsRoundedIcon
  from "@mui/icons-material/AdminPanelSettingsRounded";
import useAuthContext from "@hooks/auth/auth-provider.tsx";
import {useEffect, useState} from "react";
import {getAllUsers} from "@api/user.ts";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {MinimalUserProps} from "@api/objects.ts";
import BubbleLoader from "@components/loader/bubble-loader.tsx";
import Card from "@components/card/card.tsx";

export default function RankView()
{
  const { profile } = useAuthContext();
  const { navigate } = useNavigatorContext();
  const [users, setUsers] = useState<MinimalUserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((response) => {
        if (response.status === 401) {
          navigate(PATH.LOGIN);
        }

        const sortedUsers = response.data.users
          .sort((a: MinimalUserProps, b: MinimalUserProps) => b.score - a.score);

        setUsers(sortedUsers);
        setLoading(false);
      })
  }, []);

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
    <div className="rank-view">
      <Navigation
        text="Accueil"
        icon={<Home/>}
        redirect={PATH.HOME}
        iconButtons={navigationIconButtons.reverse()}
      />
      {loading && <BubbleLoader color="white"/>
        ||
        <div className="rank-view__list">
          <h1 className="rank-view__title">Classment</h1>
          <ul className="rank-view__users-list">
          {users.map((user, i) => (
            <li className="rank-view__user">
              <Card className={"rank-view__user-card" + (user.username === profile?.me.username ? ' me' : '')} key={i}>
                <div className="rank-view__start">
                  <p className="rank-view__user-rank">{i + 1}</p>
                  <div className="rank-view__user-profile">
                    <img
                      className="rank-view__user-avatar"
                      src={user.avatarUrl}
                      alt=""
                    />
                    <p className="rank-view__username">{user.displayName ?? user.username}</p>
                    {user.role.weight > 0 &&
                      <p className="rank-view__user-as-organiser">Orga</p>
                    }
                  </div>
                </div>
                <div className="rank-view__end">
                  <p className="rank-view__user-score">{user.score} point{user.score > 1 ? 's' : ''}</p>
                </div>
              </Card>
            </li>
          ))}
          </ul>
        </div>
      }
    </div>
  )
}
