import React from "react";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/Profile";
import ProfilePhoto from "./ProfilePhoto";
import ProfileFollowing from "./ProfileFollowing";
import { useStore } from "../../app/stores/store";

interface Props{
  profile : Profile
}

export default function ProfileContent({profile}: Props){

    const {profilestore} = useStore();

    const panes = [
        {menuItem : "About", render : () =><Tab.Pane>About Content</Tab.Pane> },
        {menuItem : "Photos", render : () =><ProfilePhoto profile={profile} /> },
        {menuItem : "Events", render : () =><Tab.Pane>Events Content</Tab.Pane> },
        {menuItem : "Followers", render : () =><ProfileFollowing />  },
        {menuItem : "Following", render : () =><ProfileFollowing /> },
    ]

    return (
      <Tab 
      menu={{fluid : true, vertical : true}}
      menuPosition="right"
      panes={panes}
      onTabChange={(e ,data) => profilestore.SetActiveTab(data.activeIndex) }
      />
    )
}