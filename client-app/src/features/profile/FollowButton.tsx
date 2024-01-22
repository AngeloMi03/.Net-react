import React, { SyntheticEvent } from "react"
import { Profile } from "../../app/models/Profile"
import { observer } from "mobx-react-lite"
import { Button, Reveal } from "semantic-ui-react"
import { useStore } from "../../app/stores/store"

interface Props{
    profile : Profile
}

export default observer(function FollowButton({profile} : Props){
    const {profilestore, userStore} = useStore()
    const {loading, updateFollowing} = profilestore

    if(userStore.user?.userName === profile.userName) return null;

    function handleFollow(e : SyntheticEvent, username : string){
        e.preventDefault()
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    return (
        <Reveal animated="move">
        <Reveal.Content visible style={{width: "100%"}}>
            <Button 
            fluid 
            color="teal" 
            content={profile.following ? "Following" : "Not Following"} 
            />
        </Reveal.Content>
        <Reveal.Content hidden style={{width: "100%"}}>
            <Button 
            fluid 
            basic
            color={profile.following ? 'red' : 'green'}
            content={profile.following ? 'Unfollow' : 'Follow'} 
            loading={loading}
            onClick={(e) => handleFollow(e, profile.userName)}
            />
        </Reveal.Content>
      </Reveal>
    )
})