import { observer } from "mobx-react-lite";
import React from "react";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/Profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profile/ProfileCard";

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
  attendees,
}: Props) {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item
              key={attendee.username}
              as={Link}
              to={`/profile/${attendee.username}`}
            >
              <Image size="mini" src={attendee.image || "/assets/user.png"} />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
