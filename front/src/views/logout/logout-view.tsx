import Cookies from 'js-cookie';
import {useEffect} from "react";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {PATH} from "@path/path.tsx";

export default function LogoutView()
{
  const { navigate } = useNavigatorContext();

  useEffect(() => {
    Cookies.remove('session');
    navigate(PATH.LOGIN);
  }, []);

  return (<div></div>);

}
