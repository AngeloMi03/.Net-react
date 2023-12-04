import React, { useEffect } from "react";
import { Grid} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";


export default observer(function ActivityDashboard() {

  const {activityStore} = useStore(); 
  const {loadActivities, activityRegistry} = activityStore

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
  
     if(activityRegistry.size <= 1) loadActivities()
  }, [activityStore,activityRegistry.size,loadActivities]);

  if (activityStore.loadingInitial) return <LoadingComponent content="loading app..." />;


  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>

      <Grid.Column width="6">
         <h2>Activity Filter</h2>
      </Grid.Column>
    </Grid>
  );
})
