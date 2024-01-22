import { observer } from "mobx-react-lite"
import React from "react"
import { useStore } from "../../app/stores/store"
import { Card, Grid, Header, Tab } from "semantic-ui-react"
import ProfileCard from "./ProfileCard"

export default observer(function ProfileFollowing(){
    const {profilestore} = useStore()
    const {profile, followings, loadingFollowing, activeTab} = profilestore

  

    return(
        <Tab.Pane loading={loadingFollowing}>
          <Grid>
            <Grid.Column width={16}>
                <Header 
                floated="left" 
                icon="user" 
                content={activeTab === 3 ? `People following ${profile?.displayName}` : `People ${profile?.displayName} is following `}  />
            </Grid.Column>
            <Grid.Column width={16}>
                <Card.Group itemsPerRow={4}>
                    {followings.map(profile => (
                        <ProfileCard key={profile.userName} profile={profile} />
                    ))}
                </Card.Group>
            </Grid.Column>
          </Grid>
        </Tab.Pane>
    )
})