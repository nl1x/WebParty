import './home-view.css';
import BubbleLoader from "@components/loader/bubble-loader.tsx";
import {useEffect, useState} from "react";
import getMe from "@api/user.ts";

export default function HomeView()
{
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getMe()
      .then((response) => setProfile(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    console.log('profile reçu: ', profile);
  }, [profile]);

  return (
    <div className="home-view">
      <h1>Home</h1>
      <BubbleLoader color='red'/>
    </div>
  )
}
