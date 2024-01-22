import { observer } from "mobx-react-lite";
import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/Profile";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface Props {
  profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.userName || "/assets/user.png"} />
      <Card.Content>
        <Card.Content>{profile.displayName}</Card.Content>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {profile.followersCount} followers
      </Card.Content>
      <FollowButton profile={profile} />
    </Card>
  );
});
