import React from "react";
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from "semantic-ui-react";
import { Profile } from "../../app/models/Profile";
import { observer } from "mobx-react-lite";
import FollowButton from "./FollowButton";

interface Props{
  profile : Profile
}

export default observer(function ProfileHeader({profile} : Props)
{
    return(
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                  <Item.Group>
                    <Item>
                        <Item.Image avatar size="small" src={profile.image || '/assets/user.png'} />
                        <Item.Content verticalAlign="middle">
                          <Header as="h1" content={profile.displayName} />
                        </Item.Content>
                    </Item>
                  </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Statistic.Group>
                    <Statistic label="Followers" value={profile.followersCount} />
                    <Statistic label="Followings" value={profile.followingCount} />
                  </Statistic.Group>
                  <Divider />
                  <FollowButton profile={profile} />
                </Grid.Column>
            </Grid>
        </Segment>
    )
})