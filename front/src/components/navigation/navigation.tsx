import './navigation.css';

import React from 'react';
import Button from "@components/button/button.tsx";
import IconButton from "@components/icon-button/icon-button.tsx";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import ImageButton from "@components/image-button/image-button.tsx";
import {PATH} from "@path/path.tsx";
import useAuthContext from "@hooks/auth/auth-provider.tsx";

export interface NavigationIconButtonsProps {
  icon: React.ReactNode;
  redirect: string;
}

interface NavigationProps {
  text: string;
  icon: React.ReactNode;
  redirect: string;
  iconButtons: NavigationIconButtonsProps[];
  showProfile?: boolean;
}

export default function Navigation({showProfile=true, ...props}: NavigationProps)
{
  const { navigate } = useNavigatorContext();
  const { profile } = useAuthContext();

  const handleRedirect = (redirect: string) => {
    navigate(redirect);
  }

  return (
    <nav className="navigation">
      <Button
        className="navigation__primary-button"
        variant="header"
        text={props.text}
        icon={props.icon}
        onClick={() => handleRedirect(props.redirect)}
      />
      <div className="navigation__icon-buttons">
        {
          props.iconButtons.map((iconButton, i) => (
            <IconButton key={i} icon={iconButton.icon} onClick={() => handleRedirect(iconButton.redirect)} />
          ))
        }
        {showProfile &&
          <ImageButton
            className="navigation__profile-picture"
            onClick={() => handleRedirect(PATH.ACCOUNT)}
            imageUrl={profile ? profile.me.avatarUrl : ""}
          />
        }
      </div>
    </nav>
  )
}
