import './not-found-view.css';
import HomeIcon from '@mui/icons-material/Home';
import {PATH} from "@path/path";
import Navigation from "@components/navigation/navigation.tsx";

export default function NotFoundView()
{

  return (
    <div className="not-found-view">
      <Navigation
        text="Accueil"
        icon={<HomeIcon/>}
        redirect={PATH.HOME}
        iconButtons={[]}
      />
      <h1>404</h1>
      <h1>Page introuvable</h1>
    </div>
  )
}
