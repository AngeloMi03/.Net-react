import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/Activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() { 

  const {activityStore} = useStore(); 

  //const [activities, setActivities] = useState<Activity[]>([]);
  //const [loading, setLoading] = useState(true);
  //const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    /*axios
        .get<Activity[]>("http://localhost:5000/api/activities")
        .then((response) => {
          console.log(response);
          setActivities(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    agent.activities.list().then((response) => {
      let Activities: Activity[] = [];
      response.forEach((actvity) => {
        actvity.date = actvity.date.split("T")[0];
        Activities.push(actvity);
      });
      setActivities(Activities);
      setLoading(false);
    });*/
  
     activityStore.loadActivities()
  }, [activityStore]);


/*
  function handleSelecteActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id == id));
  }

  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelecteActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }
  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);

    if (activity.id) {
      agent.activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.activities.create(activity).then(() => {
        setActivities([...activities, { ...activity }]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    }

    
      activity.id 
        ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
        : setActivities([...activities, {...activity, id : uuid()}]);
      setEditMode(false);
      setSelectedActivity(activity);
    }
  
     function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.activities.delete(id).then(() => {
      setActivities([...activities.filter((x) => x.id !== id)]);
    });
    setSubmitting(false);
  }
  

  */

  

 

  if (activityStore.loadingInitial) return <LoadingComponent content="loading app..." />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard  />
      </Container>
    </>
  );
}

export default  observer(App);
