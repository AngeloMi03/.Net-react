import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  //const [activities, setActivities] = useState<Activity[]>([]);
  //const [loading, setLoading] = useState(true);
  //const [submitting, setSubmitting] = useState(false);

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

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
