import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/Comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore{
    comments : ChatComment[] = []
    hubConnection : HubConnection | null = null

    constructor()
    {
        makeAutoObservable(this)
    }



    createHubConnection = (activityId : string) => {

      if(store.activityStore.selectedActivity){
        this.hubConnection = new HubConnectionBuilder()
         .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
            accessTokenFactory : () => store.userStore.user?.token!
         })
         .withAutomaticReconnect()
         .configureLogging(LogLevel.Information)
         .build();

         console.log(this.hubConnection + 'hubconnection ')

         this.hubConnection.start().catch(error => console.log("error signalR connection", error))

         this.hubConnection.on("LoadComments", (comments : ChatComment[]) => {
            runInAction(() => {
               comments.forEach((comment) => {
                  comment.createdAt = new Date(comment.createdAt + 'Z');
               })
               this.comments = comments
            })
         })

         this.hubConnection.on("ReceiveComment", (comment : ChatComment) => {
           runInAction(() =>  {
             comment.createdAt =  new Date(comment.createdAt)
             this.comments.unshift(comment)
           })
         })
 
      }
    }


    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("error signalR stopping connexion:,", error));
    }

    clearComments = () => {
        this.comments = []
        this.stopHubConnection();
    }

    addComments = async (values : any) => {
       values.activityId = store.activityStore.selectedActivity?.id;

       try {
         await this.hubConnection?.invoke("SendComment", values)
       } catch (error) {
          console.log(error)
       }
    }

   
}