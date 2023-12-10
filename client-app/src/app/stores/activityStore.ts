import {keys, makeAutoObservable, runInAction} from "mobx"
import { Activity } from "../models/Activity"
import agent from "../api/agent"
import {v4 as uuid} from "uuid"
import {format} from "date-fns";

export default class ActivityStore {
     
     activityRegistry = new Map<string,Activity>();  // <---v  activities :  Activity[] = []
     selectedActivity :  Activity | undefined = undefined
     editMode = false
     loading = false
     loadingInitial = false


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
         makeAutoObservable(this)
    }

    get activityByDate(){
       return Array.from(this.activityRegistry.values()).sort((a,b) => 
           a.date!.getTime() - b.date!.getTime()
       )
    } 

    get groupedActivities()
    {
      return Object.entries(
         this.activityByDate.reduce((activities, activity) =>{
             const date = format(activity.date!, "dd MMM yyyy");
             activities[date] = activities[date] ? [...activities[date], activity] : [activity]
             return activities;
         }, {} as {[key : string] : Activity[] })
      )
    }

    loadActivities = async () => {
       //this.loadingInitial = true;
       this.setLoadingInitial(true)
       try {
          const Activities = await agent.activities.list();
          console.log("activity store " + Activities.length)
          Activities.forEach((activity) => {
               this.setActivity(activity);
              //this.loadingInitial = false
              this.setLoadingInitial(false)
            });    
       } catch (error) {
          console.log(error)
          this.setLoadingInitial(false)
       }
    }

    loadActivity = async (id: string) => {
       let activity = this.getActivity(id); 
       if(activity) {
         this.selectedActivity = activity
         return activity
      }
       else{
         this.setLoadingInitial(true)
          try {
            activity = await agent.activities.details(id)
            this.setActivity(activity);
            runInAction(() => this.selectedActivity = activity)
            this.setLoadingInitial(false);
            return activity
          } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
          }
       }
    }

    private setActivity = (activity : Activity) => {
      activity.date = new Date(activity.date!);
      this.activityRegistry.set(activity.id,activity)    // <---this.activities.push(actvity);
    }


    private getActivity = ( id :string) =>
    {
      return this.activityRegistry.get(id);
    }

      setLoadingInitial = (state :boolean) => {
         this.loadingInitial = state;
      }

     handleSelecteActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);  // <--this.activities.find((x) => x.id == id);
      }
    
       handleCancelSelectedActivity = () => {
        this.selectedActivity = undefined;
      }


      openForm = (id? : string) => {
         id ? this.handleSelecteActivity(id) : this.handleCancelSelectedActivity();
         this.editMode = true
      }

      closeForm = () => {
         this.editMode = false;  
      }


      createActivity = async (activity : Activity) => {
         this.loading = true
         activity.id = uuid()

        try {
         await agent.activities.create(activity)
         runInAction(() =>{
            this.activityRegistry.set(activity.id,activity) // <--- this.activities.push(activity);  
            this.selectedActivity = activity;
            this.editMode = false;  
            this.loading = false;
         })
        } catch (error) {
           console.log(error)
           runInAction(() =>{
            this.loading = false;
           })
        }

      }


      updateActivity = async (activity : Activity) => {
         this.loading = true
         try {
         
            await agent.activities.create(activity)
            runInAction(() =>{
               this.activityRegistry.set(activity.id,activity);  // <--- this.activities = [...this.activities.filter(a => a.id != activity.id), activity] //create new array without activity in parameter and pass the edited activity to the array after
               this.selectedActivity = activity;
               this.editMode = false;  
               this.loading = false;
            })
            
         } catch (error) {
            console.log(error)
            runInAction(() =>{
             this.loading = false;
            })
         }
      }


      deleteActivity = async (id : string) => {
         this.loading = true
         try {
            await agent.activities.delete(id)
            this.activityRegistry.delete(id);  // <--  this.activities = [...this.activities.filter(x => x.id != id)];
            if(this.selectedActivity?.id === id) this.handleCancelSelectedActivity();
            this.loading = false;
         } catch (error) {
            console.log(error)
            runInAction(() =>{
             this.loading = false;
            })
         }
      }

  
}