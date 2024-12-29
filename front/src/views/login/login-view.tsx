import './login-view.css';

import {useEffect, useState} from "react";

import {login} from "@api/auth.ts";

import Button from "@components/button/button.tsx";
import TextInput from "@components/text-input/text-input.tsx";

import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import useAuthContext from "@hooks/auth/auth-provider.tsx";
import {PATH} from "@path/path.tsx";

export default function LoginView()
{
    const { isLoggedIn } = useAuthContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { navigate } = useNavigatorContext();

    console.log("In login view");

    useEffect(() => {
      if (isLoggedIn()) {
        navigate(PATH.HOME);
      }
    }, []);

    const handleLogin = async () => {
      setLoading(true);
      const isLoggedIn = await login(username, password);

      if (isLoggedIn) {
        navigate(PATH.HOME);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 7500);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    return (
        <>
          <div className="login-view">
              <h1 className="login-view__icon">
                  🎉
              </h1>
              <h1 className="login-view__title">
                  Nouvel an
                  <br/>
                  2025
              </h1>
              <TextInput
                  className="login-view__username"
                  placeholder={"Nom d'utilisateur"}
                  value={username}
                  leftIcon={<PersonIcon/>}
                  rightIcon={<PersonIcon sx={{ opacity: 0 }}/>}
                  onClick={() => setError(false)}
                  onPressEnter={() => handleLogin()}
                  onChange={(newValue) => setUsername(newValue)}
                  variant={error ? "error" : "default"}
                  disabled={loading}
              />
              <TextInput
                  className="login-view__username"
                  placeholder={"Mot de passe"}
                  value={password}
                  onClick={() => setError(false)}
                  onChange={(newValue) => setPassword(newValue)}
                  onPressEnter={() => handleLogin()}
                  leftIcon={<LockIcon/>}
                  rightIcon={showPassword
                      ? <VisibilityIcon className='clickable' onClick={() => setShowPassword(false)}/>
                      : <VisibilityOffIcon className='clickable' onClick={() => setShowPassword(true)}/>}
                  password={!showPassword}
                  variant={error ? "error" : "default"}
                  disabled={loading}
              />
              <Button
                  variant="primary"
                  className="login-button"
                  text="Se connecter"
                  onClick={handleLogin}
                  loading={loading}
              />
          </div>
        </>

    );
}
