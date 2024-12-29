import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {useEffect} from "react";

interface RedirectProps {
  to: string;
}

export default function Redirect(props: RedirectProps)
{
  const { navigate } = useNavigatorContext();

  useEffect(() => {
    navigate(props.to);
  }, []);

  return (<></>)
}
