import React, { SyntheticEvent, useState } from "react";
import { Activity } from "../../../app/models/Activity";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import {format} from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props{
    activity : Activity
}


export default function ActivityListItem({activity} : Props){

    const [target, setTarget] =  useState("");
    const {activityStore} = useStore();
    const { deleteActivity, loading} = activityStore 
  
    function handleActivityDelete(e : SyntheticEvent<HTMLButtonElement>, id : string){
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return(
        <Segment.Group>
          <Segment>
            {activity.isCancelled && 
              <Label attached="top" color="red" content="cancelled" style={{textAlign : "center"}} />
            }
            <Item.Group>
              <Item>
                <Item.Image style={{marginBottom : 3}} size="tiny" circular 
                   src={activity.host?.image || "/assets/user.png"} />
                <Item.Content>
                  <Item.Header as={Link} to={`/activities/${activity.id}`}>
                      {activity.title}
                  </Item.Header>
                  <Item.Description>Hosted by <Link to={`/profiles/${activity.hostUserName}`}>{activity.hostUserName}</Link></Item.Description>
                  {
                    activity.isHost && (
                      <Item.Description>
                        <Label basic color="orange">
                            You are hosting this activity
                        </Label>
                      </Item.Description>
                    )
                  }
                   {
                    !activity.isHost && activity.isGoing &&  (
                      <Item.Description>
                        <Label basic color="green">
                            You are going to this activity
                        </Label>
                      </Item.Description>
                    )
                  }
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
          <Segment>
            <span>
              <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy h:mm aaa")}
              <Icon name="marker" /> {activity.venue}
            </span>
          </Segment>
          <Segment secondary>
             <ActivityListItemAttendee attendees={activity.attendees!} />
          </Segment>
          <Segment clearing>
            <span>
              {activity.description}
            </span>
            <Button as={Link} to={`/activities/${activity.id}`} color="teal" floated="right" content="view"/>
          </Segment>
        </Segment.Group>
    )
}