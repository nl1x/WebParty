import {useEffect} from "react";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {PATH} from "@path/path.tsx";

export default function LogoutView()
{
  const { navigate } = useNavigatorContext();

  useEffect(() => {
    localStorage.removeItem('session');
    navigate(PATH.LOGIN);
  }, []);

  return (<div></div>);

}
