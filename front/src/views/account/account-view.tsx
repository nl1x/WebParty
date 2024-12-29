import './account-view.css';
import Navigation from "@components/navigation/navigation.tsx";
import HomeIcon from "@mui/icons-material/Home";
import {PATH} from "@path/path.tsx";
import useAuthContext from "@hooks/auth/auth-provider.tsx";
import DragAndDrop, {
  useDragAndDropSettings
} from "@components/drag-and-drop/drag-and-drop.tsx";
import {useEffect, useState} from "react";
import BubbleLoader from "@components/loader/bubble-loader.tsx";
import TextInput from "@components/text-input/text-input.tsx";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@components/button/button.tsx";
import {saveUserProfile} from "@api/user.ts";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";

export default function AccountView()
{
  const [loading, setLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { profile, updateUserProfile } = useAuthContext();
  const { navigate } = useNavigatorContext();
  const { file: image, setFile: setImage } = useDragAndDropSettings();

  useEffect(() => {
    if (profile)
      setLoading(false);
  }, [profile])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error])

  const handleSaveAccount = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      setError(true);
    } else {
      const response = await saveUserProfile(password, image);

      if (!response)
        setError(true);

      if (response) {
        if (response.status === 401) {
          navigate(PATH.LOGIN);
          return;
        }

        if (response.status !== 200)
          setError(true);
        else {
          setPassword("");
          setConfirmPassword("");
        }

        await updateUserProfile();
      }
      setImage(null);
    }

    setLoading(false);
  }

  return (
    loading && <BubbleLoader color="white"/>
    ||
    <div className="account-view">
      <Navigation
        text="Accueil"
        icon={<HomeIcon/>}
        redirect={PATH.HOME}
        iconButtons={[]}
        showProfile={false}
      />
      <div className="account-view__account">
        <DragAndDrop
          fileSettings={{ file: image, setFile: setImage }}
          className="account-view__account-avatar"
          defaultImage={profile?.me.avatarUrl}
        />
        <h3 className="account-view__account-name">{profile?.me.username}</h3>
        <TextInput
            className="account-view__change-password__password"
            placeholder={"Mot de passe"}
            value={password}
            onClick={() => setError(false)}
            onChange={(newValue) => setPassword(newValue)}
            onPressEnter={() => {}}
            leftIcon={<LockIcon/>}
            rightIcon={showPassword
                ? <VisibilityIcon className='clickable' onClick={() => setShowPassword(false)}/>
                : <VisibilityOffIcon className='clickable' onClick={() => setShowPassword(true)}/>}
            password={!showPassword}
            variant={error ? "error" : "default"}
            disabled={loading}
        />
        <TextInput
            className="account-view__change-password__confirm"
            placeholder={"Confirmez le mot de passe"}
            value={confirmPassword}
            onClick={() => setError(false)}
            onChange={(newValue) => setConfirmPassword(newValue)}
            onPressEnter={() => {}}
            leftIcon={<LockIcon/>}
            rightIcon={showConfirmPassword
                ? <VisibilityIcon className='clickable' onClick={() => setShowConfirmPassword(false)}/>
                : <VisibilityOffIcon className='clickable' onClick={() => setShowConfirmPassword(true)}/>}
            password={!showConfirmPassword}
            variant={error ? "error" : "default"}
            disabled={loading}
        />
        <Button
          className="account-view__account-save-button"
          text="Enregistrer"
          onClick={handleSaveAccount}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  );
}
