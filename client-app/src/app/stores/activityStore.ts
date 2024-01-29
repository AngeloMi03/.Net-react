import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/Activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/Profile";
import { Pagination, PagingParams } from "../models/Pagination";


export default class ActivityStore {
  activityRegistry = new Map<string, Activity>(); // <---v  activities :  Activity[] = []
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination : Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true);

  /*equivalent of runInAction is manage this.loadingInitial in an action
     
     runInAction(() =>{
            activities.forEach((actvity) => {
                actvity.date = actvity.date.split("T")[0];
                this.activities.push(actvity);
                this.loadingInitial = false
              });
          })
     
     */

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
         this.pagingParams =  new PagingParams();
         this.activityRegistry.clear();
         this.loadActivities();
      }
    )
  }

  setPagingParams = (pagingParams : PagingParams) => {
     this.pagingParams = pagingParams;
  }

  setPredicate = (predicate : string, value : string | Date) => {
     const resetPredicate = () => {
       this.predicate.forEach((value, key) => {
          if(key !== 'startDate') this.predicate.delete(key);
          console.log(this.predicate.get(key))
       })
     }

     switch(predicate){
       case 'all' :
           resetPredicate()
           this.predicate.set("all", true)

           break;
       case 'isGoing' :
          resetPredicate()
          this.predicate.set("isGoing", true)
          break;
       case 'isHost' :
            resetPredicate()
            this.predicate.set("isHost", true)
         break;
       case 'startDate' :
          this.predicate.delete("startDate"); //if we set the value directly, react don't trigger the change detection to update
          this.predicate.set("startDate", value)
       break;
     }
  }

  get axiosParams(){
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
       if(key == 'startDate'){
         params.append(key, (value as Date).toISOString())
       }else{
         params.append(key, value)
       }
    })

    return params;
  }

  get activityByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activityByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    //this.loadingInitial = true;
    this.setLoadingInitial(true);
    try {
      const result = await agent.activities.list(this.axiosParams);
      result.data.forEach((activity) => { 
        this.setActivity(activity);
        //this.loadingInitial = false
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setPagination = (pagination : Pagination) => {
     this.pagination = pagination;
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.activities.details(id);
        this.setActivity(activity);
        runInAction(() => (this.selectedActivity = activity));
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees?.some(
        (a) => a.userName == user.userName
      );
      activity.isHost = activity.hostUserName == user.userName;
      activity.host = activity.attendees?.find(
        (x) => x.userName == user.userName
      );
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity); // <---this.activities.push(actvity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  handleSelecteActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id); // <--this.activities.find((x) => x.id == id);
  };

  handleCancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.handleSelecteActivity(id) : this.handleCancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: ActivityFormValues) => {
    //this.loading = true;
    //activity.id = uuid();
   var user = store.userStore.user;
   var attendee = new Profile(user!);
    try {
      await agent.activities.create(activity);
      var newActivity = new Activity(activity)
      newActivity.hostUserName = user!.userName;
      newActivity.attendees= [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
       // this.activityRegistry.set(activity.id, activity); // <--- this.activities.push(activity);
        this.selectedActivity = newActivity;
        //this.editMode = false;
        //this.loading = false;
      });
    } catch (error) {
      console.log(error);
      /*runInAction(() => {
        this.loading = false;
      });*/
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.activities.create(activity);
      runInAction(() => {
        if(activity.id){
          let updatedActivity = {...this.getActivity(activity.id), ...activity};
          this.activityRegistry.set(activity.id, updatedActivity as Activity); // <--- this.activities = [...this.activities.filter(a => a.id != activity.id), activity] //create new array without activity in parameter and pass the edited activity to the array after
          this.selectedActivity = updatedActivity as Activity;
        }   
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.activities.delete(id);
      this.activityRegistry.delete(id); // <--  this.activities = [...this.activities.filter(x => x.id != id)];
      if (this.selectedActivity?.id === id) this.handleCancelSelectedActivity();
      this.loading = false;
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendency = async () => {
    var user = store.userStore.user;
    this.loading = true;
    try {
      await agent.activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.userName !== user?.userName
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  cancelActivityToggle =  async () => {
    this.loading = true;
    try {
      await agent.activities.attend(this.selectedActivity!.id)
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled
        this.activityRegistry.set( this.selectedActivity!.id,  this.selectedActivity!)
      })
    } catch (error) {
      console.log(error)
    }finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  updateActivityFollowing = (username : string) => {
     this.activityRegistry.forEach(activity => {
         activity.attendees.forEach(attendee => {
           if(attendee.userName === username)
           {
              attendee.following ? attendee.followersCount-- :  attendee.followersCount++
              attendee.following = !attendee.following
              console.log("update following " +  attendee.following);
           }
         })
     })
  }


  clearSelectedActivity = () => 
  {
   this.selectedActivity = undefined;
  }
}
